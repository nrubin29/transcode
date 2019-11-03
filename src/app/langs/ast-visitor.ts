import {
  ArithmeticNode,
  ArithmeticOperation, ArrayAccessNode,
  AssignmentNode,
  AtomNode,
  BinaryLogicalNode,
  BinaryLogicalOperation, BooleanNode,
  ComparisonNode,
  ComparisonOperation, DotAccessNode, ElseIfStatementNode, ElseStatementNode, ForLoopNode,
  FunctionCallNode, IfStatementNode,
  Node,
  RootNode, StringNode, Type,
  UnaryLogicalNode,
  UnaryLogicalOperation, WhileLoopNode
} from './ast';

/**
 * The superclass for all classes that visit a language-agnostic AST.
 * {@code T} is the type that is returned by each visit() method.
 */
export abstract class AstVisitor<T> {

  visit(node: Node): T {
    if (this === undefined) {
      throw new Error('You have to write lambda expressions as thing => this.visit(thing). Shortcuts are for the weak.');
    }

    else if (typeof node === 'number') {
      throw new Error('The generic visit() function doesn\'t work for enum values :(');
    }

    console.log(node.constructor.name, node);

    try {
      return this['visit' + node.constructor.name](node);
    }

    catch (e) {
      console.error('Missing a visitor?');
      throw e;
    }
  }

  abstract visitRootNode(root: RootNode): T;
  abstract visitAtomNode(atom: AtomNode): T;
  abstract visitBooleanNode(bool: BooleanNode): T;
  abstract visitStringNode(str: StringNode): T;
  abstract visitAssignmentNode(assignment: AssignmentNode): T;
  abstract visitArithmeticNode(arithmetic: ArithmeticNode): T;
  abstract visitUnaryLogicalNode(logic: UnaryLogicalNode): T;
  abstract visitBinaryLogicalNode(logic: BinaryLogicalNode): T;
  abstract visitComparisonNode(comparison: ComparisonNode): T;
  abstract visitFunctionCallNode(functionCall: FunctionCallNode): T;
  abstract visitDotAccessNode(dotAccess: DotAccessNode): T;
  abstract visitArrayAccessNode(arrayAccess: ArrayAccessNode): T;
  abstract visitIfStatementNode(ifStatement: IfStatementNode): T;
  abstract visitElseIfStatementNode(elseIfStatement: ElseIfStatementNode): T;
  abstract visitElseStatementNode(elseStatement: ElseStatementNode): T;
  abstract visitWhileLoopNode(whileLoop: WhileLoopNode): T;
  abstract visitForLoopNode(forLoopNode: ForLoopNode): T;

  abstract visitArithmeticOperation(operation: ArithmeticOperation): T;
  abstract visitUnaryLogicalOperation(operation: UnaryLogicalOperation): T;
  abstract visitBinaryLogicalOperation(operation: BinaryLogicalOperation): T;
  abstract visitComparisonOperation(operation: ComparisonOperation): T;

  abstract visitType(type: Type): T;
}

export abstract class StringAstVisitor extends AstVisitor<string> {
  visitRootNode(root: RootNode): string {
    return root.children.map(child => this.visit(child)).join('\n');
  }

  visitAtomNode(atom: AtomNode): string {
    return atom.atom;
  }

  visitArithmeticOperation(operation: ArithmeticOperation): string {
    switch (operation) {
      case ArithmeticOperation.ADDITION: return '+';
      case ArithmeticOperation.SUBTRACTION: return '-';
      case ArithmeticOperation.MULTIPLICATION: return '*';
      case ArithmeticOperation.DIVISION: return '/';
      case ArithmeticOperation.MODULUS: return '%';
    }
  }

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
