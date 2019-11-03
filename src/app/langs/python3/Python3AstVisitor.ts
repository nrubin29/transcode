import {AstVisitor} from '../ast-visitor';
import {
  ArithmeticNode,
  AssignmentNode,
  BinaryLogicalNode,
  BinaryLogicalOperation,
  ComparisonNode,
  FunctionCallNode,
  UnaryLogicalNode,
  UnaryLogicalOperation
} from '../ast';

export class Python3AstVisitor extends AstVisitor {

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
}
