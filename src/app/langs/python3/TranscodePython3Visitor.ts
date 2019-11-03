import {Python3Visitor} from '../../../antlr/python3/Python3Visitor';
import {
  ArithmeticNode,
  BinaryLogicalOperation,
  FunctionCallNode,
  Node,
  RootNode,
  UnaryLogicalOperation,
  ExpressionNode,
  AssignmentNode, AtomNode, BinaryLogicalNode, UnaryLogicalNode, ComparisonNode
} from '../ast';
import {
  ArglistContext,
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
} from '../../../antlr/python3/Python3Parser';
import {TranscodeVisitor} from '../transcode-visitor';
import {ParseTree} from 'antlr4ts/tree';

export class TranscodePython3Visitor extends TranscodeVisitor implements Python3Visitor<Node> {

  visitFile_input(ctx: File_inputContext) {
    return new RootNode(ctx.children.map(child => this.visit(child)));
  }

  visitPower(ctx: PowerContext) {
    if (ctx.childCount === 2 && ctx.trailer().length > 0) {
      const name = this.visitAtom(ctx.atom());
      const args = this.visitTrailer(ctx.trailer()[0]);
      return new FunctionCallNode(name, args);
    }
  }

  visitTrailer(ctx: TrailerContext) {
    if (ctx.childCount === 3 && ctx.arglist()) {
      return this.visitArglist(ctx.arglist());
    }
  }

  visitArglist(ctx: ArglistContext) {
    return ctx.argument().map(a => this.visit(a));
  }

  visitArith_expr(ctx: Arith_exprContext) {
    if (ctx.childCount === 3) {
      const left = this.visit(ctx.term()[0]);
      const right = this.visit(ctx.term()[1]);
      const operator = this.visitArithmeticOperation(ctx.getChild(1));
      return new ArithmeticNode(left, right, operator);
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
      return new AssignmentNode(left as AtomNode, right);
    }
  }

  visitOr_test(ctx: Or_testContext) {
      if (ctx.childCount === 3) {
      const left = this.visit(ctx.and_test(0));
      const right = this.visit(ctx.and_test(1));
      const operator = this.visitBinaryLogicalOperation(ctx.getChild(1));
      return new BinaryLogicalNode(left, right, operator);
    }
  }

  visitAnd_test(ctx: And_testContext) {
    if (ctx.childCount === 3) {
      const left = this.visit(ctx.not_test(0));
      const right = this.visit(ctx.not_test(1));
      const operator = this.visitBinaryLogicalOperation(ctx.getChild(1));
      return new BinaryLogicalNode(left, right, operator);
    }
  }

  visitNot_test(ctx: Not_testContext) {
    if (ctx.childCount === 2) {
      const right = this.visit(ctx.not_test());
      const operator = this.visitUnaryLogicalOperation(ctx.getChild(0));
      return new UnaryLogicalNode(right, operator);
    }
  }

  visitComparison(ctx: ComparisonContext) {
    if (ctx.childCount === 3) {
      const left = this.visit(ctx.star_expr(0));
      const right = this.visit(ctx.star_expr(1));
      const operator = this.visitComparisonOperation(ctx.comp_op(0));
      return new ComparisonNode(left, right, operator);
    }
  }

}
