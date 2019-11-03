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

export class Java9AstVisitor extends AstVisitor {

  visitFunctionCallNode(functionCall: FunctionCallNode): string {
    return this.visit(functionCall.func) + '(' + functionCall.args.map(child => this.visit(child)).join(', ') + ');';
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

  visitComparisonNode(comparison: ComparisonNode): string {
    return this.visit(comparison.left) + ' ' + this.visitComparisonOperation(comparison.operation) + ' ' + this.visit(comparison.right);
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
}
