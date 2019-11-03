import {Ast} from './ast';
import {ParserRuleContext} from 'antlr4ts';

/**
 * The interface implemented by all services that provide a language.
 * {@code R} is the root node of the ANTLR tree.
 */
export interface LanguageService<R extends ParserRuleContext> {
  convertCodeToAntlr(code: string): R;
  convertAntlrToAst(antlrRoot: R): Ast;
  convertAstToCode(ast: Ast): string;
}
