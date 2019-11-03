import {Java9Visitor} from '../../../antlr/java/Java9Visitor';
import {
  ArithmeticNode, AssignmentNode, AtomNode,
  BinaryLogicalOperation,
  ComparisonNode, DeclarationNode, DotAccessNode,
  ExpressionNode,
  FunctionCallNode, InputNode, IntConversionNode,
  Node, PrintNode,
  RootNode,
  UnaryLogicalOperation
} from '../ast';
import {
  AdditiveExpressionContext, AssignmentContext, BlockStatementsContext,
  EqualityExpressionContext,
  LocalVariableDeclarationContext,
  MethodInvocationContext,
  MultiplicativeExpressionContext,
  RelationalExpressionContext, TypeNameContext, VariableDeclaratorContext
} from '../../../antlr/java/Java9Parser';
import {TranscodeVisitor} from '../transcode-visitor';
import {ParseTree} from 'antlr4ts/tree';

export class TranscodeJava9Visitor extends TranscodeVisitor implements Java9Visitor<Node> {

  visitBlockStatements(ctx: BlockStatementsContext) {
    return new RootNode(ctx.blockStatement().map(child => this.visit(child)));
  }

  visitMethodInvocation(ctx: MethodInvocationContext) {
    let identifier: Node;
    let args: Node[];

    if (ctx.typeName()) {
      identifier = new DotAccessNode(this.visit(ctx.typeName()) as ExpressionNode, this.visit(ctx.identifier()) as AtomNode);
    }

    else {
      identifier = this.visitAtom(ctx.methodName());
    }

    if (ctx.argumentList()) {
      args = ctx.argumentList().children.map(child => this.visit(child));
    }

    else {
      args = [];
    }

    if (identifier instanceof DotAccessNode &&
      identifier.left instanceof DotAccessNode &&
      identifier.left.left instanceof AtomNode &&
      identifier.left.left.atom === 'System' &&
      identifier.left.right instanceof AtomNode &&
      identifier.left.right.atom === 'out' &&
      identifier.right instanceof AtomNode &&
      identifier.right.atom === 'println') {
      return new PrintNode(args as ExpressionNode[]);
    }

    else if (identifier instanceof DotAccessNode &&
      identifier.left instanceof AtomNode &&
      identifier.left.atom === 's' &&
      identifier.right instanceof AtomNode &&
      identifier.right.atom === 'next') {
      return new InputNode();
    }

    else if (identifier instanceof DotAccessNode &&
      identifier.left instanceof AtomNode &&
      identifier.left.atom === 'Integer' &&
      identifier.right instanceof AtomNode &&
      identifier.right.atom === 'parseInt') {
      return new IntConversionNode(args[0] as ExpressionNode);
    }

    return new FunctionCallNode(identifier as ExpressionNode, args as ExpressionNode[]);
  }

  visitTypeName(ctx: TypeNameContext) {
    if (ctx.childCount === 3) {
      const left = this.visit(ctx.packageOrTypeName());
      const right = this.visit(ctx.identifier());
      return new DotAccessNode(left as ExpressionNode, right as AtomNode);
    }
  }

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
