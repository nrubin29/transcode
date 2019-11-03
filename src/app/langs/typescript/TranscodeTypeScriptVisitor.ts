import {TypeScriptParserVisitor} from '../../../antlr/typescript/TypeScriptParserVisitor';
import {BinaryLogicalOperation, Node, RootNode, UnaryLogicalOperation} from '../ast';
import {ProgramContext} from '../../../antlr/typescript/TypeScriptParser';
import {TranscodeVisitor} from '../transcode-visitor';
import {ParseTree} from 'antlr4ts/tree';

export class TranscodeTypeScriptVisitor extends TranscodeVisitor implements TypeScriptParserVisitor<Node> {

  visitProgram(ctx: ProgramContext) {
    return new RootNode([]);
  }

  visitBinaryLogicalOperation(operation: ParseTree): BinaryLogicalOperation {
    switch (operation.text) {
      case '&&': return BinaryLogicalOperation.AND;
      case '||': return BinaryLogicalOperation.OR;
    }
  }

  visitUnaryLogicalOperation(operation: ParseTree): UnaryLogicalOperation {
    switch (operation.text) {
      case '!': return UnaryLogicalOperation.NOT;
    }
  }
}
