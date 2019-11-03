import { Injectable } from '@angular/core';
import {LanguageService} from '../language-service';
import {Ast, RootNode} from '../ast';
import {CharStreams, CommonTokenStream} from 'antlr4ts';
import {Python3Lexer} from '../../../antlr/python3/Python3Lexer';
import {File_inputContext, Python3Parser} from '../../../antlr/python3/Python3Parser';
import {TranscodePython3Visitor} from './TranscodePython3Visitor';
import {Python3AstVisitor} from './Python3AstVisitor';

@Injectable({
  providedIn: 'root'
})
export class Python3Service extends LanguageService<File_inputContext> {

  convertCodeToAntlr(code: string): File_inputContext {
    const inputStream = CharStreams.fromString(code);
    const lexer = new Python3Lexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new Python3Parser(tokenStream);
    return parser.file_input();
  }

  convertAntlrToAst(antlrRoot: File_inputContext): Ast {
    const visitor = new TranscodePython3Visitor();
    const root = visitor.visitFile_input(antlrRoot);
    root.children.splice(root.children.length - 1, 1);
    return {root};
  }

  convertAstToCode(ast: Ast): string {
    super.convertAstToCode(ast);
    const visitor = new Python3AstVisitor();
    return visitor.visit(ast.root);
  }
}
