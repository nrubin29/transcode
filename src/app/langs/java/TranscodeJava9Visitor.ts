import {Java9Visitor} from '../../../antlr/java/Java9Visitor';
import {
  ArithmeticNode, AssignmentNode, AtomNode,
  BinaryLogicalOperation,
  ComparisonNode, DeclarationNode,
  ExpressionNode,
  FunctionCallNode,
  Node,
  RootNode,
  UnaryLogicalOperation
} from '../ast';
import {
  AdditiveExpressionContext, AssignmentContext, BlockStatementsContext,
  EqualityExpressionContext,
  LocalVariableDeclarationContext,
  MethodInvocationContext,
  MultiplicativeExpressionContext,
  RelationalExpressionContext, VariableDeclaratorContext
} from '../../../antlr/java/Java9Parser';
import {TranscodeVisitor} from '../transcode-visitor';
import {ParseTree} from 'antlr4ts/tree';

export class TranscodeJava9Visitor extends TranscodeVisitor implements Java9Visitor<Node> {

  visitBlockStatements(ctx: BlockStatementsContext) {
    return new RootNode(ctx.blockStatement().map(child => this.visit(child)));
  }

  // visitExpressionStatement(ctx: ExpressionStatementContext) {
  //   return new RootNode([this.visit(ctx.children[0])]);
  // }

  visitMethodInvocation(ctx: MethodInvocationContext) {
    const identifier = this.visitAtom(ctx.methodName());
    const args = ctx.argumentList().children.map(child => this.visit(child));
    return new FunctionCallNode(identifier, args as ExpressionNode[]);
  }

  // visitLocalVariableDeclaration(ctx: LocalVariableDeclarationContext) {
  //   // TODO: Handle modifiers.
  //   const type = this.visit(ctx.unannType());
  //   const [name, value] = this.visitVariableDeclarator(ctx.variableDeclaratorList()[0]);
  //   return new AssignmentNode(name as AtomNode, value as ExpressionNode);
  // }

  visitLocalVariableDeclaration(ctx: LocalVariableDeclarationContext) {
    // TODO: Handle types.
    return this.visit(ctx.getChild(1));
  }

  visitVariableDeclarator(ctx: VariableDeclaratorContext) {
    console.log('variable');
    const name = this.visit(ctx.variableDeclaratorId());
    const value = this.visit(ctx.variableInitializer());
    return new DeclarationNode(name as AtomNode, value as ExpressionNode);
  }

  visitAssignment(ctx: AssignmentContext) {
    if (ctx.childCount === 3) {
      // TODO: look at assignmentOperator.
      const name = this.visit(ctx.leftHandSide());
      const value = this.visit(ctx.expression());
      return new AssignmentNode(name as AtomNode, value as ExpressionNode);
    }
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
