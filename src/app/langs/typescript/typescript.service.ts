import { Injectable } from '@angular/core';
import {LanguageService} from '../language-service';
import {Ast, RootNode} from '../ast';
import {ProgramContext, TypeScriptParser} from '../../../antlr/typescript/TypeScriptParser';
import {CharStreams, CommonTokenStream} from 'antlr4ts';
import {TypeScriptLexer} from '../../../antlr/typescript/TypeScriptLexer';
import {TranscodeTypeScriptVisitor} from './TranscodeTypeScriptVisitor';
import {TypeScriptAstVisitor} from './TypeScriptAstVisitor';

@Injectable({
  providedIn: 'root'
})
export class TypescriptService extends LanguageService<ProgramContext> {

  convertCodeToAntlr(code: string): ProgramContext {
    const inputStream = CharStreams.fromString(code);
    const lexer = new TypeScriptLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new TypeScriptParser(tokenStream);
    console.log('Antlr:');
    const prog = parser.program();
    console.log(prog);
    return prog;
  }

  convertAntlrToAst(antlrRoot: ProgramContext): Ast {
    const visitor = new TranscodeTypeScriptVisitor();
    const root = visitor.visitProgram(antlrRoot);
    return {root};
  }

  convertAstToCode(ast: Ast): string {
    super.convertAstToCode(ast);
    const visitor = new TypeScriptAstVisitor();
    return visitor.visit(ast.root);
  }
}
