import {
  ArithmeticNode, ArithmeticOperation, ArrayAccessNode,
  AssignmentNode, AtomNode, BinaryLogicalNode,
  BinaryLogicalOperation, BooleanNode, ComparisonNode, ComparisonOperation, DotAccessNode,
  ElseIfStatementNode,
  ElseStatementNode, ForLoopNode,
  FunctionCallNode, IfStatementNode,
  RootNode, StringNode, Type, UnaryLogicalNode, UnaryLogicalOperation, WhileLoopNode,
  Node, DeclarationNode, InputNode, IntConversionNode, PrintNode, StatementNode
} from '../langs/ast';
import {AstVisitor} from '../langs/ast-visitor';

/**
 * Traverses an AST and adds types.
 */
export class ChildrenAstVisitor extends AstVisitor<Node[]> {
  visitArithmeticNode(arithmetic: ArithmeticNode): Node[] {
    return this.visit(arithmetic.left).concat(this.visit(arithmetic.operation)).concat(this.visit(arithmetic.right));
  }

  visitArithmeticOperation(operation: ArithmeticOperation): any {
    return [];
  }

  visitArrayAccessNode(arrayAccess: ArrayAccessNode): Node[] {
    return this.visit(arrayAccess.array).concat(this.visit(arrayAccess.index));
  }

  visitAssignmentNode(assignment: AssignmentNode): Node[] {
    return this.visit(assignment.name).concat(this.visit(assignment.value));
  }

  visitAtomNode(atom: AtomNode): Node[] {
    return [atom];
  }

  visitBinaryLogicalNode(logic: BinaryLogicalNode): Node[] {
    return this.visit(logic.left).concat(this.visit(logic.operation)).concat(this.visit(logic.right));
  }

  visitBinaryLogicalOperation(operation: BinaryLogicalOperation): any {
    return [operation];
  }

  visitComparisonNode(comparison: ComparisonNode): Node[] {
    return this.visit(comparison.left).concat(this.visit(comparison.operation)).concat(this.visit(comparison.right));
  }

  visitComparisonOperation(operation: ComparisonOperation): any {
    return operation;
  }

  visitDotAccessNode(dotAccess: DotAccessNode): Node[] {
    return this.visit(dotAccess.left).concat(this.visit(dotAccess.right));
  }

  visitElseIfStatementNode(elseIfStatement: ElseIfStatementNode): Node[] {
    return this.visit(elseIfStatement.condition).concat(...elseIfStatement.statements.map(statement => this.visit(statement)));
  }

  visitElseStatementNode(elseStatement: ElseStatementNode): any {
    return [].concat(...elseStatement.statements.map(statement => this.visit(statement)));
  }

  visitForLoopNode(forLoopNode: ForLoopNode): any {
    return this.visit(forLoopNode.controlVariable).concat(this.visit(forLoopNode.start)).concat(this.visit(forLoopNode.stop)).concat(this.visit(forLoopNode.step)).concat(...forLoopNode.statements.map(statement => this.visit(statement)));
  }

  visitFunctionCallNode(functionCall: FunctionCallNode): any {
    return this.visit(functionCall.func).concat(this.visit(functionCall.args));
  }

  visitIfStatementNode(ifStatement: IfStatementNode): any {
    return this.visit(ifStatement.condition).concat(...ifStatement.statements.map(statement => this.visit(statement))).concat(...ifStatement.elseIfs.reduce((arr, statement) => arr.concat(this.visit(statement)), [])).concat(this.visit(ifStatement.els));
  }

  visitRootNode(root: RootNode): any {
    return [].concat(...root.children.map(statement => this.visit(statement)));
  }

  visitUnaryLogicalNode(logic: UnaryLogicalNode): any {
    return this.visit(logic.operation).concat(this.visit(logic.left));
  }

  visitUnaryLogicalOperation(operation: UnaryLogicalOperation): any {
    return [operation];
  }

  visitWhileLoopNode(whileLoop: WhileLoopNode): any {
    return this.visit(whileLoop.condition).concat(...whileLoop.statements.map(statement => this.visit(statement)));
  }

  visitType(type: Type): any {
    return [type];
  }

  visitBooleanNode(bool: BooleanNode): any {
    return [bool];
  }

  visitStringNode(str: StringNode): any {
    return [str];
  }

  visitDeclarationNode(declaration: DeclarationNode): Node[] {
    return this.visit(declaration.name).concat(this.visit(declaration.value));
  }

  visitInputNode(input: InputNode): Node[] {
    return [input];
  }

  visitIntConversionNode(intConversion: IntConversionNode): Node[] {
    return this.visit(intConversion.arg);
  }

  visitPrintNode(print: PrintNode): Node[] {
    return [].concat(...print.args.map(arg => this.visit(arg)));
  }

  visitStatementNode(statement: StatementNode): Node[] {
    return this.visit(statement.node);
  }
}
