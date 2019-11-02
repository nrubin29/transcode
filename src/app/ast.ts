export interface Ast {
  root: RootNode;
}

export abstract class Node {
  protected constructor() {}
}

export class RootNode extends Node {
  constructor(public children: Node[] = []) { super(); }
}

export abstract class ExpressionNode extends Node {
  // protected constructor() { super(); }
}

export class AssignmentNode extends Node {
  constructor(public name: AtomNode, public value: ExpressionNode) { super(); }
}

export class ArithmeticNode extends ExpressionNode {
  constructor(public left: ExpressionNode, public right: ExpressionNode, public operation: AtomNode) { super(); }
}

export class LogicalNode extends ExpressionNode {
  constructor(public left: ExpressionNode, public operation: AtomNode) { super(); }
}

export class BinaryLogicalNode extends LogicalNode {
  constructor(left: ExpressionNode, public right: ExpressionNode, operation: AtomNode) { super(left, operation); }
}

export class ComparisonNode extends ExpressionNode {
  constructor(public left: ExpressionNode, public right: ExpressionNode, public operation: AtomNode) { super(); }
}

export class FunctionCallNode extends ExpressionNode {
  constructor(public func: AtomNode, public args: ExpressionNode[]) { super(); }
}

export class AtomNode extends ExpressionNode {
  constructor(public atom: string) { super(); }
}
