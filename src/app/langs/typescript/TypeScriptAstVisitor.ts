import {AstVisitor} from '../ast-visitor';
import {
  ArithmeticNode, ArrayAccessNode,
  AssignmentNode,
  BinaryLogicalNode,
  BinaryLogicalOperation,
  ComparisonNode, DotAccessNode, ElseIfStatementNode, ElseStatementNode, ForLoopNode,
  FunctionCallNode, IfStatementNode,
  UnaryLogicalNode,
  UnaryLogicalOperation, WhileLoopNode
} from '../ast';

export class TypeScriptAstVisitor extends AstVisitor {
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
