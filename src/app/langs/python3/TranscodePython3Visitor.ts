/* tslint:disable:prefer-const */
import {Python3Visitor} from '../../../antlr/python3/Python3Visitor';
import {
  ArithmeticNode,
  BinaryLogicalOperation,
  FunctionCallNode,
  Node,
  RootNode,
  UnaryLogicalOperation,
  ExpressionNode,
  AssignmentNode,
  AtomNode,
  BinaryLogicalNode,
  UnaryLogicalNode,
  ComparisonNode,
  IfStatementNode,
  ElseStatementNode,
  BooleanNode,
  StringNode,
  PrintNode, InputNode, IntConversionNode, ElseIfStatementNode, StatementNode, ForLoopNode
} from '../ast';
import {
  ArglistContext,
  StmtContext,
  Arith_exprContext,
  AtomContext,
  File_inputContext,
  PowerContext,
  TrailerContext,
  Expr_stmtContext,
  Testlist_star_exprContext,
  Or_testContext,
  And_testContext,
  Not_testContext,
  ComparisonContext,
  If_stmtContext,
  For_stmtContext,
} from '../../../antlr/python3/Python3Parser';
import {TranscodeVisitor} from '../transcode-visitor';
import {ParseTree} from 'antlr4ts/tree';
import {Statement} from '@angular/compiler';
import {range} from 'rxjs';

export class TranscodePython3Visitor extends TranscodeVisitor implements Python3Visitor<Node> {

  visitFile_input(ctx: File_inputContext) {
    return new RootNode(ctx.children.map(child => this.visit(child)) as StatementNode[]);
  }

  visitStmt(ctx: StmtContext) {
    if (ctx.compound_stmt()) {
      return undefined;
    }
    else {
      return new StatementNode(this.visit(ctx.getChild(0)));
    }
  }

  visitPower(ctx: PowerContext) {
    if (ctx.childCount === 2 && ctx.trailer().length > 0) {
      const name = this.visitAtom(ctx.atom());
      const args = this.visitTrailer(ctx.trailer()[0]);
      if (name.atom === 'print') {
        return new PrintNode(args as ExpressionNode[]);
      }
      else if (name.atom === 'input') {
        return new InputNode();
      }
      else if (name.atom === 'int') {
        return new IntConversionNode(args[0] as ExpressionNode);
      }
      return new FunctionCallNode(name, args as ExpressionNode[]);
    }

  }

  visitTrailer(ctx: TrailerContext) {
    if (ctx.childCount === 3 && ctx.arglist()) {
      return this.visitArglist(ctx.arglist());
    }
  }

  visitArglist(ctx: ArglistContext): any {
    return ctx.argument().map(a => this.visit(a));
  }

  // TODO: Add multiple operand support
  visitArith_expr(ctx: Arith_exprContext) {
    if (ctx.childCount === 3) {
      const left = this.visit(ctx.term()[0]);
      const right = this.visit(ctx.term()[1]);
      const operator = this.visitArithmeticOperation(ctx.getChild(1));
      return new ArithmeticNode(left as ExpressionNode, right as ExpressionNode, operator);
    }
  }

  visitBinaryLogicalOperation(operation: ParseTree): BinaryLogicalOperation {
    switch (operation.text) {
      case 'and': return BinaryLogicalOperation.AND;
      case 'or': return BinaryLogicalOperation.OR;
    }
  }

  visitUnaryLogicalOperation(operation: ParseTree): UnaryLogicalOperation {
    switch (operation.text) {
      case 'not': return UnaryLogicalOperation.NOT;
    }
  }

  visitExpr_stmt(ctx: Expr_stmtContext) {
    if (ctx.childCount === 3) {
      // Should be of type AtomNode
      const left = this.visit(ctx.testlist_star_expr(0));
      // Should be of type ExpressionNode
      const right = this.visit(ctx.testlist_star_expr(1));
      return new AssignmentNode(left as AtomNode, right as ExpressionNode);
    }
  }

  visitOr_test(ctx: Or_testContext) {
      if (ctx.childCount === 3) {
      const left = this.visit(ctx.and_test(0));
      const right = this.visit(ctx.and_test(1));
      const operator = this.visitBinaryLogicalOperation(ctx.getChild(1));
      return new BinaryLogicalNode(left as ExpressionNode, right as ExpressionNode, operator);
    }
  }

  visitAnd_test(ctx: And_testContext) {
    if (ctx.childCount === 3) {
      const left = this.visit(ctx.not_test(0));
      const right = this.visit(ctx.not_test(1));
      const operator = this.visitBinaryLogicalOperation(ctx.getChild(1));
      return new BinaryLogicalNode(left as ExpressionNode, right as ExpressionNode, operator);
    }
  }

  visitNot_test(ctx: Not_testContext) {
    if (ctx.childCount === 2) {
      const right = this.visit(ctx.not_test());
      const operator = this.visitUnaryLogicalOperation(ctx.getChild(0));
      return new UnaryLogicalNode(right as ExpressionNode, operator);
    }
  }

  visitComparison(ctx: ComparisonContext) {
    if (ctx.childCount === 3) {
      const left = this.visit(ctx.star_expr(0));
      const right = this.visit(ctx.star_expr(1));
      const operator = this.visitComparisonOperation(ctx.comp_op(0));
      return new ComparisonNode(left as ExpressionNode, right as ExpressionNode, operator);
    }
  }

  visitAtom(ctx: ParseTree): AtomNode {
    if (ctx.text === 'True' || ctx.text === 'False') {
      return new BooleanNode(ctx.text === 'True');
    } else if (ctx.text.startsWith('"') || ctx.text.startsWith('\'')) {
      return new StringNode(ctx.text.substring(1, ctx.text.length - 1));
    }

    return super.visitAtom(ctx);
  }

  // TODO: Add if-elif support
  visitIf_stmt(ctx: If_stmtContext) {
    let ifStatement: StatementNode[] = [];
    let elseStatement: StatementNode[] = [];
    let condition;
    if (ctx.childCount === 4) {
      condition = this.visit(ctx.test(0));
      ctx.suite(0).stmt().map(item => ifStatement.push(this.visit(item) as StatementNode));
      return new IfStatementNode(condition, ifStatement);
    } else if (ctx.childCount === 7) {
      condition = this.visit(ctx.test(0));
      ctx.suite(0).stmt().map(item => ifStatement.push(this.visit(item) as StatementNode));
      ctx.suite(1).stmt().map(item => elseStatement.push(this.visit(item) as StatementNode));
      return new IfStatementNode(condition, ifStatement, [],  new ElseStatementNode(elseStatement));
    }
    else if (ctx.childCount > 7) {
      let elseIfs: ElseIfStatementNode[] = [];
      const ifCondition = this.visit(ctx.test(0));
      ctx.suite(0).stmt().map(item => ifStatement.push(this.visit(item) as StatementNode));
      // Constructing elseifsNode
      for (let i = 1; i < ctx.test().length; i++) {
        const elseIfCondition = this.visit(ctx.test(i));
        let statements: StatementNode[] = [];
        ctx.suite(i).stmt().map(item => statements.push(this.visit(item) as StatementNode));
        elseIfs.push(new ElseIfStatementNode(elseIfCondition as ExpressionNode, statements));
      }
      if (ctx.ELSE()) {
        console.log('HERE: ', ctx.ELSE());
        ctx.suite(ctx.suite().length - 1).stmt().map(item => elseStatement.push(this.visit(item) as StatementNode));
        return new IfStatementNode(ifCondition as ExpressionNode, ifStatement, elseIfs, new ElseStatementNode(elseStatement));
      }
      else {
        return new IfStatementNode(ifCondition as ExpressionNode, ifStatement, elseIfs);
      }
    }
  }

  visitFor_stmt(ctx: For_stmtContext) {
    if (ctx.childCount === 6) {
      let start: ExpressionNode = new AtomNode('0');
      let stop: ExpressionNode;
      let step: ExpressionNode = new AtomNode('1');
      let forStatements: StatementNode[] = [];
      const controlVariable = this.visit(ctx.getChild(1));
      const rangeNode: FunctionCallNode = this.visit(ctx.getChild(3)) as FunctionCallNode;
      if (rangeNode.args.length === 1) {
        stop = rangeNode.args[0];
      }
      else {
        start = rangeNode.args[0];
        stop = rangeNode.args[1];
        step = rangeNode.args.length === 3 ? rangeNode.args[2] : new AtomNode('1');
      }
      ctx.suite(0).stmt().map(item => forStatements.push(this.visit(item) as StatementNode));
      return new ForLoopNode(controlVariable as AtomNode, start, stop, step, forStatements);
    }
  }
}
