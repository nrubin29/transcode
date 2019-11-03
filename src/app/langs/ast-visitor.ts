import {
  ArithmeticNode,
  ArithmeticOperation,
  AssignmentNode,
  AtomNode,
  BinaryLogicalNode,
  BinaryLogicalOperation,
  ComparisonNode,
  ComparisonOperation,
  FunctionCallNode,
  Node,
  RootNode,
  UnaryLogicalNode,
  UnaryLogicalOperation
} from './ast';

/**
 * The superclass for all classes that visit a language-agnostic AST.
 */
export abstract class AstVisitor {

  visit(node: Node): string {
    if (this === undefined) {
      throw new Error('You have to write lambda expressions as thing => this.visit(thing). Shortcuts are for the weak.');
    }

    else if (typeof node === 'number') {
      throw new Error('The generic visit() function doesn\'t work for enum values :(');
    }

    console.log(node.constructor.name);

    try {
      return this['visit' + node.constructor.name](node);
    }

    catch {
      console.error('Missing a visitor!');
    }
  }

  visitRootNode(root: RootNode): string {
    return root.children.map(child => this.visit(child)).join('\n');
  }

  visitAtomNode(atom: AtomNode): string {
    return atom.atom;
  }

  abstract visitAssignmentNode(assignment: AssignmentNode): string;
  abstract visitArithmeticNode(arithmetic: ArithmeticNode): string;
  abstract visitUnaryLogicalNode(logic: UnaryLogicalNode): string;
  abstract visitBinaryLogicalNode(logic: BinaryLogicalNode): string;
  abstract visitComparisonNode(comparison: ComparisonNode): string;
  abstract visitFunctionCallNode(functionCall: FunctionCallNode): string;

  visitArithmeticOperation(operation: ArithmeticOperation): string {
    switch (operation) {
      case ArithmeticOperation.ADDITION: return '+';
      case ArithmeticOperation.SUBTRACTION: return '-';
      case ArithmeticOperation.MULTIPLICATION: return '*';
      case ArithmeticOperation.DIVISION: return '/';
      case ArithmeticOperation.MODULUS: return '%';
    }
  }

  abstract visitUnaryLogicalOperation(operation: UnaryLogicalOperation): string;
  abstract visitBinaryLogicalOperation(operation: BinaryLogicalOperation): string;

  visitComparisonOperation(operation: ComparisonOperation): string {
    switch (operation) {
      case ComparisonOperation.EQUALS: return '==';
      case ComparisonOperation.NOT_EQUALS: return '!=';
      case ComparisonOperation.GREATER_THAN: return '>';
      case ComparisonOperation.LESS_THAN: return '<';
      case ComparisonOperation.GREATER_THAN_EQUAL_TO: return '>=';
      case ComparisonOperation.LESS_THAN_EQUAL_TO: return '<=';
    }
  }
}
