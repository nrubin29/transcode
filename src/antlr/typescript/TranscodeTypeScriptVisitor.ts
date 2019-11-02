import {TypeScriptParserVisitor} from "./TypeScriptParserVisitor";
import {Node, RootNode} from '../../app/ast';
import {ProgramContext} from './TypeScriptParser';
import {TranscodeVisitor} from '../transcode-visitor';

export class TranscodeTypeScriptVisitor extends TranscodeVisitor implements TypeScriptParserVisitor<Node> {

  visitProgram(ctx: ProgramContext) {
    return new RootNode([]);
  }
}
