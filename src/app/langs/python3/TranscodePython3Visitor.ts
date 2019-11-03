import {Python3Visitor} from '../../../antlr/python3/Python3Visitor';
import {ArithmeticNode, BinaryLogicalOperation, FunctionCallNode, Node, RootNode, UnaryLogicalOperation} from '../ast';
import {
  ArglistContext,
  Arith_exprContext,
  AtomContext,
  File_inputContext,
  PowerContext,
  TrailerContext
} from '../../../antlr/python3/Python3Parser';
import {TranscodeVisitor} from '../transcode-visitor';
import {ParseTree} from 'antlr4ts/tree';

export class TranscodePython3Visitor extends TranscodeVisitor implements Python3Visitor<Node> {

  visitFile_input(ctx: File_inputContext) {
    return new RootNode(ctx.children.map(child => this.visit(child)));
  }

  visitPower(ctx: PowerContext) {
    if (ctx.childCount === 2 && ctx.trailer().length > 0) {
      const name = this.visitAtom(ctx.atom());
      const args = this.visitTrailer(ctx.trailer()[0]);
      return new FunctionCallNode(name, args);
    }
  }

  visitTrailer(ctx: TrailerContext) {
    if (ctx.childCount === 3 && ctx.arglist()) {
      return this.visitArglist(ctx.arglist());
    }
  }

  visitArglist(ctx: ArglistContext) {
    return ctx.argument().map(a => this.visit(a));
  }

  visitArith_expr(ctx: Arith_exprContext) {
    if (ctx.childCount === 3) {
      const left = this.visit(ctx.term()[0]);
      const right = this.visit(ctx.term()[1]);
      const operator = this.visitArithmeticOperation(ctx.getChild(1));
      return new ArithmeticNode(left, right, operator);
    }
  }

  visitBinaryLogicalOperation(operation: ParseTree): BinaryLogicalOperation {
    switch (operation.text) {
      case 'and': return BinaryLogicalOperation.AND;
      case 'or': return BinaryLogicalOperation.OR;
    }
  }

  visitUnaryLogicalOperation(operation: ParseTree): UnaryLogicalOperation {
    switch (operation.text) {
      case 'not': return UnaryLogicalOperation.NOT;
    }
  }
}
