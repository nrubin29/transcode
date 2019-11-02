import {Python3Visitor} from './Python3Visitor';
import {AtomNode, FunctionCallNode, RootNode, Node, ArithmeticNode} from '../../app/ast';
import {
  ArglistContext,
  Arith_exprContext,
  AtomContext,
  File_inputContext,
  PowerContext,
  TrailerContext
} from './Python3Parser';
import {TranscodeVisitor} from '../transcode-visitor';

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

    else {
      return this.visit(ctx.getChild(0));
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
      const operator = this.visitAtom(ctx.getChild(1) as AtomContext);
      return new ArithmeticNode(left, right, operator);
    }

    else {
      return this.visit(ctx.getChild(0));
    }
  }
}
