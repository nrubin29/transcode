export enum ArithmeticOperation {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
  MULTIPLICATION = 'MULTIPLICATION',
  DIVISION = 'DIVISION',
  MODULUS = 'MODULUS'
}

export enum UnaryLogicalOperation {
  NOT = 'NOT'
}

export enum BinaryLogicalOperation {
  AND = 'AND',
  OR = 'OR'
}

export enum ComparisonOperation {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN_EQUAL_TO = 'LESS_THAN_EQUAL_TO',
  GREATER_THAN_EQUAL_TO = 'GREATER_THAN_EQUAL_TO'
}

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
  constructor(public left: ExpressionNode, public right: ExpressionNode, public operation: ArithmeticOperation) { super(); }
}

export class UnaryLogicalNode extends ExpressionNode {
  constructor(public left: ExpressionNode, public operation: UnaryLogicalOperation) { super(); }
}

export class BinaryLogicalNode extends ExpressionNode {
  constructor(public left: ExpressionNode, public right: ExpressionNode, public operation: BinaryLogicalOperation) { super(); }
}

export class ComparisonNode extends ExpressionNode {
  constructor(public left: ExpressionNode, public right: ExpressionNode, public operation: ComparisonOperation) { super(); }
}

export class FunctionCallNode extends ExpressionNode {
  constructor(public func: AtomNode, public args: ExpressionNode[]) { super(); }
}

export class AtomNode extends ExpressionNode {
  constructor(public atom: string) { super(); }
}
