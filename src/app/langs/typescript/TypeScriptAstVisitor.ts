import {StringAstVisitor} from '../ast-visitor';
import {
  ArithmeticNode,
  ArrayAccessNode,
  AssignmentNode,
  BinaryLogicalNode,
  BinaryLogicalOperation,
  BooleanNode,
  ComparisonNode,
  DotAccessNode,
  ElseIfStatementNode,
  ElseStatementNode,
  ForLoopNode,
  FunctionCallNode,
  IfStatementNode,
  PrimitiveType,
  StringNode,
  Type,
  UnaryLogicalNode,
  UnaryLogicalOperation,
  WhileLoopNode
} from '../ast';
import {log} from 'util';

export class TypeScriptAstVisitor extends StringAstVisitor {
  visitArrayAccessNode(arrayAccess: ArrayAccessNode): string {
    return this.visit(arrayAccess.array) + '[' + this.visit(arrayAccess.index) + ']';
  }

  visitDotAccessNode(dotAccess: DotAccessNode): string {
    return this.visit(dotAccess.left) + '.' + this.visit(dotAccess.right);
  }

  visitElseIfStatementNode(elseIfStatement: ElseIfStatementNode): string {
    return 'else if (' + this.visit(elseIfStatement.condition) + ') {\n' +
        elseIfStatement.statements.map(stat => '\t' + this.visit(stat)).join('\n') +
      '\n}';
  }

  visitElseStatementNode(elseStatement: ElseStatementNode): string {
    return 'else {\n' + elseStatement.statements.map(stat => '\t' + this.visit(stat)).join('\n') + '\n}';
  }

  visitForLoopNode(forLoopNode: ForLoopNode): string {
    const i = this.visit(forLoopNode.controlVariable)
    return 'for (let ' + i + ' = ' + this.visit(forLoopNode.start) + '; ' +
      i + ' < ' + this.visit(forLoopNode.stop) + '; ' +
      this.visit(forLoopNode.step) === '1' ? (i + '++') : (i + ' += ' + this.visit(forLoopNode.step) ) + ' ) {\n' +
      forLoopNode.statements.map(stat => '\t' + this.visit(stat)).join('\n') +
      '\n}';
  }

  visitIfStatementNode(ifStatement: IfStatementNode): string {
    return 'if ( ' + this.visit(ifStatement.condition) + ' ) {\n' +
      ifStatement.statements.map(stat => '\t' + this.visit(stat)).join('\n') +
      '\n}';
  }

  visitWhileLoopNode(whileLoop: WhileLoopNode): string {
    return 'while (' + this.visit(whileLoop.condition) + ' ) {\n' +
      whileLoop.statements.map(stat => '\t' + this.visit(stat)).join('\n') +
      '\n}';
  }

  visitArithmeticNode(arithmetic: ArithmeticNode): string {
    return this.visit(arithmetic.left) + ' ' + this.visitArithmeticOperation(arithmetic.operation) + ' ' + this.visit(arithmetic.right);
  }

  visitAssignmentNode(assignment: AssignmentNode): string {
    return 'let ' + this.visit(assignment.name) + ' = ' + this.visit(assignment.value) + ';';
  }

  visitBinaryLogicalNode(logic: BinaryLogicalNode): string {
    return this.visit(logic.left) + ' ' + this.visitBinaryLogicalOperation(logic.operation) + ' ' + this.visit(logic.right);
  }

  visitBinaryLogicalOperation(operation: BinaryLogicalOperation): string {
    switch (operation) {
      case BinaryLogicalOperation.AND:
        return '&&';
      case BinaryLogicalOperation.OR:
        return '||';
    }
  }

  visitComparisonNode(comparison: ComparisonNode): string {
    return this.visit(comparison.left) + ' ' + this.visitComparisonOperation(comparison.operation) + ' ' + this.visit(comparison.right);
  }

  visitFunctionCallNode(functionCall: FunctionCallNode): string {
    return this.visit(functionCall.func) + '(' + functionCall.args.map(arg => this.visit(arg)).join(', ') + ')';
  }

  visitUnaryLogicalNode(logic: UnaryLogicalNode): string {
    return this.visitUnaryLogicalOperation(logic.operation) + this.visit(logic.left);
  }

  visitUnaryLogicalOperation(operation: UnaryLogicalOperation): string {
    switch (operation) {
      case UnaryLogicalOperation.NOT:
        return '!';
    }
  }

  visitType(type: Type): string {
    let typeName: string;

    switch (type.type) {
      case PrimitiveType.BOOLEAN: typeName = 'boolean'; break;
      case PrimitiveType.FLOAT: typeName = 'number'; break;
      case PrimitiveType.INTEGER: typeName = 'number'; break;
      case PrimitiveType.OBJECT: typeName = 'object'; break;
      case PrimitiveType.STRING: typeName = 'string'; break;
    }

    if (type.isArray) {
      typeName += '[]';
    }

    return typeName;
  }

  visitBooleanNode(bool: BooleanNode): string {
    return bool.value ? 'true' : 'false';
  }

  visitStringNode(str: StringNode): string {
    return '\'' + str.atom + '\'';
  }
}
