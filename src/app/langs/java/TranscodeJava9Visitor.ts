import {Java9Visitor} from '../../../antlr/java/Java9Visitor';
import {
  ArithmeticNode,
  BinaryLogicalOperation,
  ComparisonNode,
  ExpressionNode,
  FunctionCallNode,
  Node,
  RootNode,
  UnaryLogicalOperation
} from '../ast';
import {
  AdditiveExpressionContext,
  EqualityExpressionContext,
  ExpressionStatementContext,
  MethodInvocationContext,
  MultiplicativeExpressionContext,
  RelationalExpressionContext
} from '../../../antlr/java/Java9Parser';
import {TranscodeVisitor} from '../transcode-visitor';
import {ParseTree} from 'antlr4ts/tree';

export class TranscodeJava9Visitor extends TranscodeVisitor implements Java9Visitor<Node> {

  visitExpressionStatement(ctx: ExpressionStatementContext) {
    return new RootNode([this.visit(ctx.children[0])]);
  }

  visitMethodInvocation(ctx: MethodInvocationContext) {
    const identifier = this.visitAtom(ctx.methodName());
    const args = ctx.argumentList().children.map(child => this.visit(child));
    return new FunctionCallNode(identifier, args as ExpressionNode[]);
  }

  visitAdditiveExpression(ctx: AdditiveExpressionContext) {
    if (ctx.childCount === 3) {
      const lhs = this.visit(ctx.additiveExpression());
      const rhs = this.visit(ctx.multiplicativeExpression());
      const operator = this.visitArithmeticOperation(ctx.getChild(1));
      return new ArithmeticNode(lhs as ExpressionNode, rhs as ExpressionNode, operator);
    }
  }

  visitMultiplicativeExpression(ctx: MultiplicativeExpressionContext) {
    if (ctx.childCount === 3) {
      const lhs = this.visit(ctx.multiplicativeExpression());
      const rhs = this.visit(ctx.unaryExpression());
      const operator = this.visitArithmeticOperation(ctx.getChild(1));
      return new ArithmeticNode(lhs as ExpressionNode, rhs as ExpressionNode, operator);
    }
  }

  visitEqualityExpression(ctx: EqualityExpressionContext) {
    if (ctx.childCount === 3) {
      const lhs = this.visit(ctx.equalityExpression());
      const rhs = this.visit(ctx.relationalExpression());
      const operator = this.visitComparisonOperation(ctx.getChild(1));
      return new ComparisonNode(lhs as ExpressionNode, rhs as ExpressionNode, operator);
    }
  }

  visitRelationalExpression(ctx: RelationalExpressionContext) {
    // TODO: instanceof should be a separate node.
    if (ctx.childCount === 3) {
      const lhs = this.visit(ctx.relationalExpression());
      const rhs = this.visit(ctx.shiftExpression());
      const operator = this.visitComparisonOperation(ctx.getChild(1));
      return new ComparisonNode(lhs as ExpressionNode, rhs as ExpressionNode, operator);
    }
  }

  visitUnaryLogicalOperation(operation: ParseTree): UnaryLogicalOperation {
    switch (operation.text) {
      case '!': return UnaryLogicalOperation.NOT;
    }
  }

  visitBinaryLogicalOperation(operation: ParseTree): BinaryLogicalOperation {
    switch (operation.text) {
      case '&&': return BinaryLogicalOperation.AND;
      case '||': return BinaryLogicalOperation.OR;
    }
  }
}
