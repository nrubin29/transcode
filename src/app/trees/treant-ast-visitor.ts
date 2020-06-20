import {
  ArithmeticNode, ArithmeticOperation, ArrayAccessNode, AssignmentNode,
  AtomNode,
  BinaryLogicalNode,
  BinaryLogicalOperation, BooleanNode, ComparisonNode,
  ComparisonOperation, DeclarationNode, DotAccessNode,
  ElseIfStatementNode,
  ElseStatementNode, ForLoopNode, FunctionCallNode, IfStatementNode, InputNode, IntConversionNode, IntNode, PrintNode,
  RootNode, StatementNode, StringNode, Type,
  UnaryLogicalNode, UnaryLogicalOperation, WhileLoopNode
} from '../langs/ast';
import {AstVisitor} from '../langs/ast-visitor';

/**
 * Traverses an AST and returns an object that can be used by Treant.
 */
export class TreantAstVisitor extends AstVisitor<object> {

  visitStatementNode(statement: StatementNode): object {
    return {
      text: {name: 'Statement'},
      children: [this.visit(statement.node)]
    };
  }

  visitArithmeticNode(arithmetic: ArithmeticNode): object {
    return {
      text: {name: 'Arithmetic'},
      children: [this.visit(arithmetic.left), this.visitArithmeticOperation(arithmetic.operation), this.visit(arithmetic.right)]
    };
  }

  visitArithmeticOperation(operation: ArithmeticOperation): object {
    return {
      text: {name: operation},
    };
  }

  visitArrayAccessNode(arrayAccess: ArrayAccessNode): object {
    return {
      text: {name: 'ArrayAccess'},
      children: [this.visit(arrayAccess.array), this.visit(arrayAccess.index)]
    };
  }

  visitDeclarationNode(declaration: DeclarationNode): object {
    return {
      text: {name: 'Declaration'},
      children: [this.visit(declaration.name), this.visit(declaration.value)]
    };
  }

  visitAssignmentNode(assignment: AssignmentNode): object {
    return {
      text: {name: 'Assignment'},
      children: [this.visit(assignment.name), this.visit(assignment.value)]
    };
  }

  visitAtomNode(atom: AtomNode): object {
    return {
      text: {name: atom.atom},
    };
  }


  visitBinaryLogicalNode(logic: BinaryLogicalNode): object {
    return {
      text: {name: 'BinaryLogical'},
      children: [this.visit(logic.left), this.visitBinaryLogicalOperation(logic.operation), this.visit(logic.right)]
    };
  }

  visitBinaryLogicalOperation(operation: BinaryLogicalOperation): object {
    return {
      text: {name: operation},
    };
  }

  visitComparisonNode(comparison: ComparisonNode): object {
    return {
      text: {name: 'Comparison'},
      children: [this.visit(comparison.left), this.visitComparisonOperation(comparison.operation), this.visit(comparison.right)]
    };
  }

  visitComparisonOperation(operation: ComparisonOperation): object {
    return {
      text: {name: operation},
    };
  }

  visitDotAccessNode(dotAccess: DotAccessNode): object {
    return {
      text: {name: 'DotAccess'},
      children: [this.visit(dotAccess.left), this.visit(dotAccess.right)]
    };
  }

  visitElseIfStatementNode(elseIfStatement: ElseIfStatementNode): object {
    return {
      text: {name: 'ElseIf'},
      children: [this.visit(elseIfStatement.condition), ...elseIfStatement.statements.map(s => this.visit(s))]
    };
  }

  visitElseStatementNode(elseStatement: ElseStatementNode): object {
    return {
      text: {name: 'Else'},
      children: elseStatement.statements.map(s => this.visit(s))
    };
  }

  visitForLoopNode(forLoopNode: ForLoopNode): object {
    return {
      text: {name: 'ForLoop'},
      children: [this.visit(forLoopNode.controlVariable), this.visit(forLoopNode.start), this.visit(forLoopNode.stop), this.visit(forLoopNode.step), ...forLoopNode.statements.map(s => this.visit(s))]
    };
  }

  visitFunctionCallNode(functionCall: FunctionCallNode): object {
    return {
      text: {name: 'FunctionCall'},
      children: [this.visit(functionCall.func), ...functionCall.args.map(s => this.visit(s))]
    };
  }

  visitIfStatementNode(ifStatement: IfStatementNode): object {
    return {
      text: {name: 'If'},
      children: [this.visit(ifStatement.condition), ...ifStatement.statements.map(s => this.visit(s)), ...ifStatement.elseIfs.map(s => this.visit(s)), ...(ifStatement.els ? [this.visit(ifStatement.els)] : [])]
    };
  }

  visitRootNode(root: RootNode): object {
    return {
      text: {name: 'Root'},
      children: [...root.children.map(s => this.visit(s))]
    };
  }

  visitUnaryLogicalNode(logic: UnaryLogicalNode): object {
    return {
      text: {name: 'UnaryLogical'},
      children: [this.visitUnaryLogicalOperation(logic.operation), this.visit(logic.left)]
    };
  }

  visitUnaryLogicalOperation(operation: UnaryLogicalOperation): object {
    return {
      text: {name: operation},
    };
  }

  visitWhileLoopNode(whileLoop: WhileLoopNode): object {
    return {
      text: {name: 'While'},
      children: [this.visit(whileLoop.condition), ...whileLoop.statements.map(s => this.visit(s))]
    };
  }

  visitType(type: Type): object {
    return {
      text: {name: type.type + (type.isArray ? '[]' : [])},
    };
  }

  visitBooleanNode(bool: BooleanNode): object {
    return {
      text: {name: bool.value},
    };
  }

  visitStringNode(str: StringNode): object {
    return {
      text: {name: str.atom},
    };
  }

  visitIntNode(int: IntNode): object {
    return {
      text: {name: int.value}
    };
  }

  visitInputNode(input: InputNode): object {
    return {
      text: {name: 'Input'},
    };
  }

  visitPrintNode(print: PrintNode): object {
    return {
      text: {name: 'Print'},
      children: [...print.args.map(s => this.visit(s))]
    };
  }

  visitIntConversionNode(intConversion: IntConversionNode): object {
    return {
      text: {name: 'IntConversion'},
      children: [this.visit(intConversion.arg)]
    };
  }
}
