import {ParseTree} from 'antlr4ts/tree';
import {AtomNode, Node} from '../app/ast';

export class TranscodeVisitor {
  visit(tree: ParseTree): Node {
    try {
      const node = tree.accept(this as any);

      if (!node) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(':O');
      }

      return node;
    }

    catch (e) {
      if (e.message !== ':O') {
        console.error(e);
      }

      if (tree.childCount > 0) {
        return this.visit(tree.getChild(0));
      }

      return undefined;
    }
  }

  visitChildren(node: any): Node {
    throw new Error(':O');
  }

  visitTerminal(node: any): Node {
    throw new Error(':O');
  }

  visitErrorNode(node: any): Node {
    throw new Error(':O');
  }

  visitAtom(ctx: ParseTree) {
    return new AtomNode(ctx.text);
  }
}
