import {TypeScriptParserVisitor} from '../../../antlr/typescript/TypeScriptParserVisitor';
import {
  ArithmeticNode, ArrayAccessNode,
  AssignmentNode,
  AtomNode,
  BinaryLogicalNode,
  BinaryLogicalOperation,
  ComparisonNode,
  DotAccessNode, ElseIfStatementNode, ElseStatementNode,
  ExpressionNode,
  FunctionCallNode, IfStatementNode,
  Node,
  RootNode,
  UnaryLogicalNode,
  UnaryLogicalOperation
} from '../ast';
import {
  AdditiveExpressionContext,
  ArgumentsExpressionContext, ArrayLiteralContext, BlockContext,
  EqualityExpressionContext,
  ExpressionSequenceContext,
  IdentifierExpressionContext,
  IdentifierNameContext, IfStatementContext,
  LogicalAndExpressionContext, LogicalOrExpressionContext,
  MemberDotExpressionContext, MemberIndexExpressionContext,
  MultiplicativeExpressionContext,
  NotExpressionContext,
  ParenthesizedExpressionContext,
  ProgramContext,
  RelationalExpressionContext,
  SingleExpressionContext, StatementListContext,
  VariableDeclarationContext, VariableStatementContext
} from '../../../antlr/typescript/TypeScriptParser';
import {TranscodeVisitor} from '../transcode-visitor';
import {ParseTree, TerminalNode} from 'antlr4ts/tree';
import {ArgumentContext} from '../../../antlr/python3/Python3Parser';

export class TranscodeTypeScriptVisitor extends TranscodeVisitor implements TypeScriptParserVisitor<Node> {

  // Program start
  visitProgram(ctx: ProgramContext) {
    return new RootNode(ctx.sourceElements().children.map(child => this.visit(child)));
  }

  visitBinaryLogicalOperation(operation: ParseTree): BinaryLogicalOperation {
    switch (operation.text) {
      case '&&': return BinaryLogicalOperation.AND;
      case '||': return BinaryLogicalOperation.OR;
    }
  }

  visitUnaryLogicalOperation(operation: ParseTree): UnaryLogicalOperation {
    switch (operation.text) {
      case '!': return UnaryLogicalOperation.NOT;
    }
  }

  visitVariableStatement(ctx: VariableStatementContext) {
    if (ctx.variableDeclarationList()) {
      return this.visit(ctx.variableDeclarationList());
    }
  }

  // Variable assignments and Function Calls
  visitVariableDeclaration(ctx: VariableDeclarationContext) {
    if (ctx.childCount === 2) {
      if (ctx.getChild(1) instanceof ParenthesizedExpressionContext) {
        // Function Call
        const func = this.visit(ctx.getChild(0));
        // Get the center of the parenthesized expression as an expression sequence.
        const expressionSeq = ctx.getChild(1).getChild(1) as ExpressionSequenceContext;
        // Process expression sequence into arguments
        const args: ExpressionNode[] = [];
        for (const child of expressionSeq.children) {
          if (child instanceof TerminalNode) {
            // Ignore the commas between arguments
            if (child.text !== ',') {
              args.push(new AtomNode(child.text));
            }
          } else {
            args.push(this.visit(child) as ExpressionNode);
          }
        }
        // Create and return function
        return new FunctionCallNode(name, args);
      }
    } else if (ctx.childCount === 3) {
      // Traditional assignment aka a = b
      const ident = this.visit(ctx.Identifier());
      const expression = this.visit(ctx.getChild(2));
      return new AssignmentNode(ident as AtomNode, expression as ExpressionNode);
    }
  }

  // Different type of function call
  visitArgumentsExpression(ctx: ArgumentsExpressionContext) {
    const lhs = this.visit(ctx.getChild(0));

    const argContext = ctx.getChild(1) as ArgumentContext;

    const args: ExpressionNode[] = [];
    for (const child of argContext.children) {
      if (child instanceof TerminalNode) {
        // Ignore the commas between arguments
        if (child.text !== ',' && child.text !== '(' && child.text !== ')') {
          args.push(new AtomNode(child.text));
        }
      } else {
        args.push(this.visit(child) as ExpressionNode);
      }
    }

    return new FunctionCallNode(lhs as ExpressionNode, args);
  }

  visitIdentifierExpression(ctx: IdentifierExpressionContext) {
    if (ctx.childCount === 2) {
      if (ctx.getChild(0) instanceof IdentifierNameContext) {
        const lhs = this.visit(ctx.getChild(0));
        if (ctx.getChild(1) instanceof SingleExpressionContext) {
          const opExpr = ctx.getChild(1);
          if (opExpr.childCount === 2) {
            if (opExpr.getChild(0) instanceof TerminalNode && opExpr.getChild(1) instanceof SingleExpressionContext) {
              const oper = this.visitArithmeticOperation(opExpr.getChild(0));
              const rhsExpr = opExpr.getChild(1);
              if (rhsExpr.childCount === 1) {
                // Non-Arithmetic addition aka a + b but not 4 + 5
                const rhs = this.visit(rhsExpr.getChild(0));

                return new ArithmeticNode(lhs as ExpressionNode, rhs as ExpressionNode, oper);
              }
            }
          } else if (opExpr.childCount === 1 && opExpr.getChild(0) instanceof ArrayLiteralContext) {
            // Array accessing with single index
            const arrayLit = opExpr.getChild(0);
            const elements = arrayLit.getChild(1);
            // This will only get the first element in the list,
            // intentional because index access should only have 1 element.
            const indexExp = this.visit(elements);
            return new ArrayAccessNode(lhs as ExpressionNode, indexExp as ExpressionNode);
          }
        }
      }
    }
  }

  // Dot Access

  visitMemberDotExpression(ctx: MemberDotExpressionContext) {
    const lhs = this.visit(ctx.getChild(0));
    const right = this.visit(ctx.getChild(2));

    return new DotAccessNode(lhs as ExpressionNode, right as AtomNode);
  }

  // Array index access

  visitMemberIndexExpression(ctx: MemberIndexExpressionContext) {
    const arrExpr = this.visit(ctx.getChild(0));
    const indexExpr = this.visit(ctx.getChild(2));

    return new ArrayAccessNode(arrExpr as ExpressionNode, indexExpr as ExpressionNode);
  }

  // Arithmetic Stuff

  visitMultiplicativeExpression(ctx: MultiplicativeExpressionContext) {
    const lhs = this.visit(ctx.getChild(0));
    const oper = this.visitArithmeticOperation(ctx.getChild(1));
    const rhs = this.visit(ctx.getChild(2));
    return new ArithmeticNode(lhs as ExpressionNode, rhs as ExpressionNode, oper);
  }

  visitAdditiveExpression(ctx: AdditiveExpressionContext) {
    const lhs = this.visit(ctx.getChild(0));
    const oper = this.visitArithmeticOperation(ctx.getChild(1));
    const rhs = this.visit(ctx.getChild(2));
    return new ArithmeticNode(lhs as ExpressionNode, rhs as ExpressionNode, oper);
  }

  // Comparison Stuff

  visitRelationalExpression(ctx: RelationalExpressionContext) {
    const lhs = this.visit(ctx.getChild(0));
    const oper = this.visitComparisonOperation(ctx.getChild(1));
    const rhs = this.visit(ctx.getChild(2));

    return new ComparisonNode(lhs as ExpressionNode, rhs as ExpressionNode, oper);
  }

  visitEqualityExpression(ctx: EqualityExpressionContext) {
    const lhs = this.visit(ctx.getChild(0));
    const oper = this.visitComparisonOperation(ctx.getChild(1));
    const rhs = this.visit(ctx.getChild(2));

    return new ComparisonNode(lhs as ExpressionNode, rhs as ExpressionNode, oper);
  }


  visitIdentifierName(ctx: IdentifierNameContext) {
    if (ctx.childCount === 1) {
      return this.visit(ctx.getChild(0));
    }
  }

  // Logical

  visitNotExpression(ctx: NotExpressionContext) {
    const expr = this.visit(ctx.getChild(1));
    return new UnaryLogicalNode(expr as ExpressionNode, UnaryLogicalOperation.NOT);
  }

  visitLogicalAndExpression(ctx: LogicalAndExpressionContext) {
    const lhs = this.visit(ctx.getChild(0));
    const rhs = this.visit(ctx.getChild(2));
    return new BinaryLogicalNode(lhs as ExpressionNode, rhs as ExpressionNode, BinaryLogicalOperation.AND);
  }

  visitLogicalOrExpression(ctx: LogicalOrExpressionContext) {
    const lhs = this.visit(ctx.getChild(0));
    const rhs = this.visit(ctx.getChild(2));
    return new BinaryLogicalNode(lhs as ExpressionNode, rhs as ExpressionNode, BinaryLogicalOperation.OR);
  }

  // If statement

  visitIfStatement(ctx: IfStatementContext) {
    const expr = this.visit(ctx.getChild(2));

    // const elseIfs: ElseIfStatementNode[] = [];
    // const else: ElseStatementNode;
    // // Check for else-ifs and final else
    //
    // // If we have an else statement
    // if (ctx.children)

    // Parse statement into things
    const statement = ctx.getChild(4);
    let statements: ExpressionNode[] = [];

    if (statement.getChild(0) instanceof BlockContext) {
      const stateList = statement.getChild(0).getChild(1) as StatementListContext;
      for (const child of stateList.children) {
        statements.push(this.visit(child) as ExpressionNode);
      }

      return new IfStatementNode(expr as ExpressionNode, statements);
    } else {
      statements = [this.visit(statement.getChild(0)) as ExpressionNode];
      return new IfStatementNode(expr as ExpressionNode, statements);
    }
  }
}
