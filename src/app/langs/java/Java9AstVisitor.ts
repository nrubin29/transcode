import {StringAstVisitor} from '../ast-visitor';
import {
  ArithmeticNode, ArrayAccessNode,
  AssignmentNode,
  BinaryLogicalNode,
  BinaryLogicalOperation, BooleanNode,
  ComparisonNode, DeclarationNode, DotAccessNode, ElseIfStatementNode, ElseStatementNode, ForLoopNode,
  FunctionCallNode, IfStatementNode, PrimitiveType, StringNode, Type,
  UnaryLogicalNode,
  UnaryLogicalOperation, WhileLoopNode
} from '../ast';

export class Java9AstVisitor extends StringAstVisitor {
  variablesSeen = new Set<string>();

  visitFunctionCallNode(functionCall: FunctionCallNode): string {
    return this.visit(functionCall.func) + '(' + functionCall.args.map(child => this.visit(child)).join(', ') + ');';
  }

  visitArithmeticNode(arithmetic: ArithmeticNode): string {
    return this.visit(arithmetic.left) + ' ' + this.visitArithmeticOperation(arithmetic.operation) + ' ' + this.visit(arithmetic.right);
  }

  visitAssignmentNode(assignment: AssignmentNode): string {
    if (this.variablesSeen.has(assignment.name.atom)) {
      return this.visit(assignment.name) + ' = ' + this.visit(assignment.value) + ';';
    }

    else {
      // This is a hack because Python can't differentiate between assignments and declarations.
      this.variablesSeen.add(assignment.name.atom);
      return this.visitDeclarationNode(new DeclarationNode(assignment.name, assignment.value));
    }
  }

  visitBinaryLogicalNode(logic: BinaryLogicalNode): string {
    return this.visit(logic.left) + ' ' + this.visitBinaryLogicalOperation(logic.operation) + ' ' + this.visit(logic.right);
  }

  visitComparisonNode(comparison: ComparisonNode): string {
    return this.visit(comparison.left) + ' ' + this.visitComparisonOperation(comparison.operation) + ' ' + this.visit(comparison.right);
  }

  visitDeclarationNode(declaration: DeclarationNode): string {
    return this.visitType(declaration.value.type) + ' ' + this.visit(declaration.name) + ' = ' + this.visit(declaration.value) + ';';
  }

  visitUnaryLogicalNode(logic: UnaryLogicalNode): string {
    return this.visitUnaryLogicalOperation(logic.operation) + this.visit(logic.left);
  }

  visitBinaryLogicalOperation(operation: BinaryLogicalOperation): string {
    switch (operation) {
      case BinaryLogicalOperation.AND: return '&&';
      case BinaryLogicalOperation.OR: return '||';
    }
  }

  visitUnaryLogicalOperation(operation: UnaryLogicalOperation): string {
    switch (operation) {
      case UnaryLogicalOperation.NOT: return '!';
    }
  }

  visitArrayAccessNode(arrayAccess: ArrayAccessNode): string {
    return this.visit(arrayAccess.array)  + '[' + this.visit(arrayAccess.index) + ']';
  }

  visitDotAccessNode(dotAccess: DotAccessNode): string {
    return this.visit(dotAccess.left)  + '.' + this.visit(dotAccess.right);
  }

  visitElseIfStatementNode(elseIfStatement: ElseIfStatementNode): string {
    return 'else if (' + this.visit(elseIfStatement.condition) + ') {' + elseIfStatement.statements.map(statement => '\t' + this.visit(statement)).join('\n') + '}';
  }

  visitElseStatementNode(elseStatement: ElseStatementNode): string {
    return 'else {' + elseStatement.statements.map(statement => '\t' + this.visit(statement)) + '}';
  }

  visitForLoopNode(forLoopNode: ForLoopNode): string {
    return 'for (' + this.visitType(forLoopNode.start.type) + ' ' + this.visit(forLoopNode.controlVariable) + ' = ' + this.visit(forLoopNode.start) + '; ' + this.visit(forLoopNode.controlVariable) + ' < ' + this.visit(forLoopNode.stop) + '; ' + this.visit(forLoopNode.controlVariable) + ' += ' + this.visit(forLoopNode.step) + ' {' + forLoopNode.statements.map(statement => '\t' + this.visit(statement)) + '}';
  }

  visitIfStatementNode(ifStatement: IfStatementNode): string {
    return 'if (' + this.visit(ifStatement.condition) + ') {' + ifStatement.statements.map(statement => '\t' + this.visit(statement)) + '}' + ifStatement.elseIfs.map(elseIf => this.visit(elseIf)).join('\n') + (ifStatement.els ? this.visit(ifStatement.els) : '');
  }

  visitWhileLoopNode(whileLoop: WhileLoopNode): string {
    return 'while (' + this.visit(whileLoop.condition) + ') {' + whileLoop.statements.map(statement => '\t' + this.visit(statement)).join('\n') + '}';
  }

  visitBooleanNode(bool: BooleanNode): string {
    return bool.value ? 'true' : 'false';
  }

  visitStringNode(str: StringNode): string {
    return '"' + str.atom + '"';
  }

  visitType(type: Type): string {
    let typeName: string;

    switch (type.type) {
      case PrimitiveType.BOOLEAN: typeName = 'boolean'; break;
      case PrimitiveType.FLOAT: typeName = 'float'; break;
      case PrimitiveType.INTEGER: typeName = 'int'; break;
      case PrimitiveType.OBJECT: typeName = 'Object'; break;
      case PrimitiveType.STRING: typeName = 'String'; break;
    }

    if (type.isArray) {
      typeName += '[]';
    }

    return typeName;
  }
}
