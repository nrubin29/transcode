import {StringAstVisitor} from '../ast-visitor';
import {
  ArithmeticNode, ArrayAccessNode,
  AssignmentNode,
  BinaryLogicalNode,
  BinaryLogicalOperation, BooleanNode,
  ComparisonNode, DotAccessNode, ElseIfStatementNode, ElseStatementNode, ForLoopNode,
  FunctionCallNode, IfStatementNode, PrimitiveType, StringNode, Type,
  UnaryLogicalNode,
  UnaryLogicalOperation, WhileLoopNode
} from '../ast';

export class Python3AstVisitor extends StringAstVisitor {

  visitArithmeticNode(arithmetic: ArithmeticNode): string {
    return '';
  }

  visitAssignmentNode(assignment: AssignmentNode): string {
    return '';
  }

  visitBinaryLogicalNode(logic: BinaryLogicalNode): string {
    return '';
  }

  visitBinaryLogicalOperation(operation: BinaryLogicalOperation): string {
    return '';
  }

  visitComparisonNode(comparison: ComparisonNode): string {
    return '';
  }

  visitFunctionCallNode(functionCall: FunctionCallNode): string {
    return '';
  }

  visitUnaryLogicalNode(logic: UnaryLogicalNode): string {
    return '';
  }

  visitUnaryLogicalOperation(operation: UnaryLogicalOperation): string {
    return '';
  }

  visitArrayAccessNode(arrayAccess: ArrayAccessNode): string {
    return '';
  }

  visitDotAccessNode(dotAccess: DotAccessNode): string {
    return '';
  }

  visitElseIfStatementNode(elseIfStatement: ElseIfStatementNode): string {
    return '';
  }

  visitElseStatementNode(elseStatement: ElseStatementNode): string {
    return '';
  }

  visitForLoopNode(forLoopNode: ForLoopNode): string {
    return '';
  }

  visitIfStatementNode(ifStatement: IfStatementNode): string {
    return '';
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
    let typeName: string;

    switch (type.type) {
      case PrimitiveType.BOOLEAN: typeName = 'bool'; break;
      case PrimitiveType.FLOAT: typeName = 'float'; break;
      case PrimitiveType.INTEGER: typeName = 'int'; break;
      case PrimitiveType.OBJECT: typeName = 'object'; break;
      case PrimitiveType.STRING: typeName = 'str'; break;
    }

    if (type.isArray) {
      typeName += '[]';
    }

    return typeName;
  }
}
