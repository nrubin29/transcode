import {StringAstVisitor} from '../ast-visitor';
import {
  ArithmeticNode, ArrayAccessNode,
  AssignmentNode,
  BinaryLogicalNode,
  BinaryLogicalOperation, BooleanNode,
  ComparisonNode, DeclarationNode, DotAccessNode, ElseIfStatementNode, ElseStatementNode, ForLoopNode,
  FunctionCallNode, IfStatementNode, InputNode, IntConversionNode, PrimitiveType, PrintNode, StatementNode, StringNode, Type,
  UnaryLogicalNode,
  UnaryLogicalOperation, WhileLoopNode
} from '../ast';

export class Python3AstVisitor extends StringAstVisitor {

  visitStatementNode(statement: StatementNode): string {
    return this.visit(statement.node);
  }

  visitArithmeticNode(arithmetic: ArithmeticNode): string {
    return this.visit(arithmetic.left) + ' ' + this.visitArithmeticOperation(arithmetic.operation) + ' ' + this.visit(arithmetic.right);
  }

  visitAssignmentNode(assignment: AssignmentNode): string {
    return this.visit(assignment.name) + ' = ' + this.visit(assignment.value);
  }

  visitBinaryLogicalNode(logic: BinaryLogicalNode): string {
    return this.visit(logic.left) + ' ' + this.visitBinaryLogicalOperation(logic.operation) + ' ' + this.visit(logic.right);
  }

  visitBinaryLogicalOperation(operation: BinaryLogicalOperation): string {
    switch (operation) {
      case BinaryLogicalOperation.AND: return 'and';
      case BinaryLogicalOperation.OR: return 'or';
    }  }

  visitComparisonNode(comparison: ComparisonNode): string {
    return this.visit(comparison.left) + ' ' + this.visitComparisonOperation(comparison.operation) + ' ' + this.visit(comparison.right);
  }

  visitFunctionCallNode(functionCall: FunctionCallNode): string {
    return this.visit(functionCall.func) + '(' + functionCall.args.map(child => this.visit(child)).join(', ') + ')';
  }

  visitUnaryLogicalNode(logic: UnaryLogicalNode): string {
    return this.visitUnaryLogicalOperation(logic.operation) + this.visit(logic.left);
  }

  visitUnaryLogicalOperation(operation: UnaryLogicalOperation): string {
    switch (operation) {
      case UnaryLogicalOperation.NOT: return 'not';
    }
  }

  visitArrayAccessNode(arrayAccess: ArrayAccessNode): string {
    return '';
  }

  visitDotAccessNode(dotAccess: DotAccessNode): string {
    return '';
  }

  visitElseIfStatementNode(elseIfStatement: ElseIfStatementNode): string {
    return 'elif ' + this.visit(elseIfStatement.condition) + ':\n'
      + elseIfStatement.statements.map(child => '  ' + this.visit(child)).join('\n');
  }

  visitElseStatementNode(elseStatement: ElseStatementNode): string {
    return 'else:\n' + elseStatement.statements.map(child => '  ' + this.visit(child)).join('\n');
  }

  visitForLoopNode(forLoopNode: ForLoopNode): string {
    return 'for ' + forLoopNode.controlVariable.atom + ' in range(' + (this.visit(forLoopNode.start) ? this.visit(forLoopNode.start) + ', ' : '')
      + this.visit(forLoopNode.stop) + (this.visit(forLoopNode.step) === '1' ? '' : ', ' + this.visit(forLoopNode.step)) + '):'
      + '\n' + forLoopNode.statements.map(child => '  ' + this.visit(child)).join('\n');
  }

  visitIfStatementNode(ifStatement: IfStatementNode): string {
    return 'if ' + this.visit(ifStatement.condition) + ':\n' + ifStatement.statements.map(child => '  ' + this.visit(child)).join('\n')
       + '\n' + (ifStatement.elseIfs ? ifStatement.elseIfs.map(elseIfBlock => this.visitElseIfStatementNode(elseIfBlock)).join('\n') : '')
        + '\n' + (ifStatement.els ? this.visitElseStatementNode(ifStatement.els) : '');
  }

  visitWhileLoopNode(whileLoop: WhileLoopNode): string {
    return '';
  }

  visitBooleanNode(bool: BooleanNode): string {
    return bool.value ? 'True' : 'False';
  }

  visitStringNode(str: StringNode): string {
    return '\'' + str.atom + '\'';
  }

  visitType(type: Type): string {
    let typeName: string = '';

    if (type.isArray) {
      typeName = 'Array[';
    }

    switch (type.type) {
      case PrimitiveType.BOOLEAN: typeName += 'bool'; break;
      case PrimitiveType.FLOAT: typeName += 'float'; break;
      case PrimitiveType.INTEGER: typeName += 'int'; break;
      case PrimitiveType.OBJECT: typeName += 'object'; break;
      case PrimitiveType.STRING: typeName += 'str'; break;
    }

    if (type.isArray) {
      typeName += ']';
    }

    return typeName;
  }

  visitDeclarationNode(declaration: DeclarationNode): string {
    return this.visit(declaration.name) + ' = ' + this.visit(declaration.value);
  }

  visitInputNode(input: InputNode): string {
    return 'input()';
  }

  visitIntConversionNode(intConversion: IntConversionNode): string {
    return 'int(' + this.visit(intConversion.arg) + ')';
  }

  visitPrintNode(print: PrintNode): string {
    return 'print(' + print.args.map(child => this.visit(child)).join(', ') + ')';
  }

}
