import { Injectable } from '@angular/core';
import {LanguageService} from './language-service';
import {Ast, RootNode} from '../ast';
import {ProgramContext, TypeScriptParser} from '../../antlr/typescript/TypeScriptParser';
import {CharStreams, CommonTokenStream} from 'antlr4ts';
import {TypeScriptLexer} from '../../antlr/typescript/TypeScriptLexer';
import {TranscodeTypeScriptVisitor} from '../../antlr/typescript/TranscodeTypeScriptVisitor';

@Injectable({
  providedIn: 'root'
})
export class TypescriptService implements LanguageService<ProgramContext> {

  convertCodeToAntlr(code: string): ProgramContext {
    const inputStream = CharStreams.fromString(code);
    const lexer = new TypeScriptLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new TypeScriptParser(tokenStream);
    return parser.program();
  }

  convertAntlrToAst(antlrRoot: ProgramContext): Ast {
    const visitor = new TranscodeTypeScriptVisitor();
    const root = visitor.visitProgram(antlrRoot);
    return {root};
  }

  convertAstToCode(ast: Ast): string {
    return '';
  }
}
