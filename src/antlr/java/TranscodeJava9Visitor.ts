import {Java9Visitor} from './Java9Visitor';
import {ParseTree} from 'antlr4ts/tree';
import {ArithmeticNode, AtomNode, ComparisonNode, FunctionCallNode, Node, RootNode} from '../../app/ast';
import {
  AdditiveExpressionContext, EqualityExpressionContext,
  IdentifierContext,
  LiteralContext,
  MultiplicativeExpressionContext, RelationalExpressionContext, MethodInvocationContext, ExpressionStatementContext
} from './Java9Parser';
import {TranscodeVisitor} from '../transcode-visitor';

export class TranscodeJava9Visitor extends TranscodeVisitor implements Java9Visitor<Node> {

  visitExpressionStatement(ctx: ExpressionStatementContext) {
    return new RootNode([this.visit(ctx.children[0])]);
  }

  visitMethodInvocation(ctx: MethodInvocationContext) {
    const identifier = this.visitAtom(ctx.methodName());
    const args = ctx.argumentList().children.map(child => this.visit(child));
    return new FunctionCallNode(identifier, args);
  }

  visitAdditiveExpression(ctx: AdditiveExpressionContext) {
    if (ctx.childCount === 3) {
      const lhs = this.visit(ctx.additiveExpression());
      const rhs = this.visit(ctx.multiplicativeExpression());
      const operator = this.visitAtom(ctx.getChild(1));
      return new ArithmeticNode(lhs, rhs, operator);
    }
  }

  visitMultiplicativeExpression(ctx: MultiplicativeExpressionContext) {
    if (ctx.childCount === 3) {
      const lhs = this.visit(ctx.multiplicativeExpression());
      const rhs = this.visit(ctx.unaryExpression());
      const operator = this.visitAtom(ctx.getChild(1));
      return new ArithmeticNode(lhs, rhs, operator);
    }
  }

  visitEqualityExpression(ctx: EqualityExpressionContext) {
    if (ctx.childCount === 3) {
      const lhs = this.visit(ctx.equalityExpression());
      const rhs = this.visit(ctx.relationalExpression());
      const operator = this.visitAtom(ctx.getChild(1));
      return new ComparisonNode(lhs, rhs, operator);
    }
  }

  visitRelationalExpression(ctx: RelationalExpressionContext) {
    // TODO: instanceof should be a separate node.
    if (ctx.childCount === 3) {
      const lhs = this.visit(ctx.relationalExpression());
      const rhs = this.visit(ctx.shiftExpression());
      const operator = this.visitAtom(ctx.getChild(1));
      return new ComparisonNode(lhs, rhs, operator);
    }
  }

  visitIdentifier(ctx: IdentifierContext) {
    return this.visitAtom(ctx);
  }

  visitLiteral(ctx: LiteralContext) {
    return this.visitAtom(ctx);
  }
}
