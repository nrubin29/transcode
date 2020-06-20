import {
  ArithmeticNode,
  ArithmeticOperation, ArrayAccessNode,
  AssignmentNode,
  AtomNode,
  BinaryLogicalNode,
  BinaryLogicalOperation, BooleanNode,
  ComparisonNode,
  ComparisonOperation, DeclarationNode, DotAccessNode, ElseIfStatementNode, ElseStatementNode, ForLoopNode,
  FunctionCallNode, IfStatementNode, InputNode, IntConversionNode,
  Node, PrintNode,
  RootNode, StatementNode, StringNode, Type,
  UnaryLogicalNode,
  UnaryLogicalOperation, WhileLoopNode
} from './ast';

/**
 * The superclass for all classes that visit a language-agnostic AST.
 * {@code T} is the type that is returned by each visit() method.
 */
export abstract class AstVisitor<T> {
  // private readonly nodeVisitors: {[node: string]: (node: AstVisitor<T>) => (node: Node) => T};
  //
  // constructor() {
  //   console.log('AtomNode', AtomNode.constructor.name);
  //
  //   this.nodeVisitors = {
  //     [AtomNode.constructor.name]: (ths: AstVisitor<T>) => ths.visitAtomNode,
  //     [BooleanNode.constructor.name]: (ths) => ths.visitBooleanNode,
  //     [StringNode.constructor.name]: (ths) => ths.visitStringNode,
  //     [RootNode.constructor.name]: (ths) => ths.visitRootNode,
  //     [StatementNode.constructor.name]: (ths) => ths.visitStatementNode,
  //     [DeclarationNode.constructor.name]: (ths) => ths.visitDeclarationNode,
  //     [AssignmentNode.constructor.name]: (ths) => ths.visitAssignmentNode,
  //     [ArithmeticNode.constructor.name]: (ths) => ths.visitArithmeticNode,
  //     [UnaryLogicalNode.constructor.name]: (ths) => ths.visitUnaryLogicalNode,
  //     [BinaryLogicalNode.constructor.name]: (ths) => ths.visitBinaryLogicalNode,
  //     [ComparisonNode.constructor.name]: (ths) => ths.visitComparisonNode,
  //     [FunctionCallNode.constructor.name]: (ths) => ths.visitFunctionCallNode,
  //     [DotAccessNode.constructor.name]: (ths) => ths.visitDotAccessNode,
  //     [ArrayAccessNode.constructor.name]: (ths) => ths.visitArrayAccessNode,
  //     [IfStatementNode.constructor.name]: (ths) => ths.visitIfStatementNode,
  //     [ElseIfStatementNode.constructor.name]: (ths) => ths.visitElseIfStatementNode,
  //     [ElseStatementNode.constructor.name]: (ths) => ths.visitElseStatementNode,
  //     [WhileLoopNode.constructor.name]: (ths) => ths.visitWhileLoopNode,
  //     [ForLoopNode.constructor.name]: (ths) => ths.visitForLoopNode,
  //     [PrintNode.constructor.name]: (ths) => ths.visitPrintNode,
  //     [InputNode.constructor.name]: (ths) => ths.visitInputNode,
  //     [IntConversionNode.constructor.name]: (ths) => ths.visitIntConversionNode
  //   };
  // }

  visit(node: Node): T {
    if (this === undefined) {
      throw new Error('You have to write lambda expressions as thing => this.visit(thing). Shortcuts are for the weak.');
    }

    else if (typeof node === 'string') {
      throw new Error('The generic visit() function doesn\'t work for enum values :(');
    }

    // console.log(this.nodeVisitors);
    console.log(node.constructor.name, node);

    // return this.nodeVisitors[node.constructor.name](this)(node);
    return this['visit' + node.constructor.name](node);
  }

  abstract visitAtomNode(atom: AtomNode): T;
  abstract visitBooleanNode(bool: BooleanNode): T;
  abstract visitStringNode(str: StringNode): T;

  abstract visitRootNode(root: RootNode): T;
  abstract visitStatementNode(statement: StatementNode): T;
  abstract visitDeclarationNode(declaration: DeclarationNode): T;
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

  abstract visitPrintNode(print: PrintNode): T;
  abstract visitInputNode(input: InputNode): T;
  abstract visitIntConversionNode(intConversion: IntConversionNode): T;

  abstract visitArithmeticOperation(operation: ArithmeticOperation): T;
  abstract visitUnaryLogicalOperation(operation: UnaryLogicalOperation): T;
  abstract visitBinaryLogicalOperation(operation: BinaryLogicalOperation): T;
  abstract visitComparisonOperation(operation: ComparisonOperation): T;

  abstract visitType(type: Type): T;
}

export abstract class StringAstVisitor extends AstVisitor<string> {

  visit(node: Node): string {
    return this.indentation(node.depth) + super.visit(node);
  }

  indentation(depth: number) {
    return '  '.repeat(depth);
  }

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
