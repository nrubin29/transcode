import { Injectable } from '@angular/core';
import {LanguageService} from './language-service';
import {Ast} from '../ast';
import {CharStreams, CommonTokenStream} from 'antlr4ts';
import {Java9Lexer} from '../../antlr/java/Java9Lexer';
import {ExpressionContext, ExpressionStatementContext, Java9Parser} from '../../antlr/java/Java9Parser';
import {TranscodeJava9Visitor} from '../../antlr/java/TranscodeJava9Visitor';

@Injectable({
  providedIn: 'root'
})
export class JavaService implements LanguageService<ExpressionStatementContext> {

  convertCodeToAntlr(code: string): ExpressionStatementContext {
    const inputStream = CharStreams.fromString(code);
    const lexer = new Java9Lexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new Java9Parser(tokenStream);
    return parser.expressionStatement();
  }

  convertAntlrToAst(antlrRoot: ExpressionStatementContext): Ast {
    const visitor = new TranscodeJava9Visitor();
    const root = visitor.visitExpressionStatement(antlrRoot);
    return {root};
  }

  convertAstToCode(ast: Ast): string {
    return JSON.stringify(ast.root);
  }
}
