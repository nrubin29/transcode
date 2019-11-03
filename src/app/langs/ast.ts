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

export enum PrimitiveType {
  INTEGER = 'INTEGER',
  FLOAT = 'FLOAT',
  BOOLEAN = 'BOOLEAN',
  STRING = 'STRING',
  OBJECT = 'OBJECT'
}

export interface Type {
  type: PrimitiveType;
  isArray: boolean;
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
  type: Type;
  // protected constructor() { super(); }
}

export class DeclarationNode extends Node {
  constructor(public name: AtomNode, public value: ExpressionNode) { super(); }
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
  constructor(public func: ExpressionNode, public args: ExpressionNode[]) { super(); }
}

export class DotAccessNode extends ExpressionNode {
  constructor(public left: ExpressionNode, public right: AtomNode) { super(); }
}

export class ArrayAccessNode extends ExpressionNode {
  constructor(public array: ExpressionNode, public index: ExpressionNode) { super(); }
}

export class IfStatementNode extends Node {
  constructor(public condition: ExpressionNode, public statements: Node[], public elseIfs: ElseIfStatementNode[] = [], public els?: ElseStatementNode) { super(); }
}

export class ElseIfStatementNode extends Node {
  constructor(public condition: ExpressionNode, public statements: Node[]) { super(); }
}

export class ElseStatementNode extends Node {
  constructor(public statements: Node[]) { super(); }
}

export class WhileLoopNode extends Node {
  constructor(public condition: ExpressionNode, public statements: Node[]) { super(); }
}

export class ForLoopNode extends Node {
  constructor(public controlVariable: AtomNode, public start: ExpressionNode, public stop: ExpressionNode, public step: ExpressionNode, public statements: Node[]) { super(); }
}

export class PrintNode extends Node {
  constructor(public args: ExpressionNode[]) { super(); }
}

export class InputNode extends ExpressionNode {
  // TODO: Add prompt?
  constructor() { super(); }
}

export class IntConversionNode extends ExpressionNode {
  constructor(public arg: ExpressionNode) { super(); }
}

export class AtomNode extends ExpressionNode {
  constructor(public atom: string) { super(); }
}

export class StringNode extends AtomNode {
  constructor(str: string) { super(str); }
}

export class BooleanNode extends AtomNode {
  constructor(public value: boolean) { super(value ? 'TRUE' : 'FALSE'); }
}
