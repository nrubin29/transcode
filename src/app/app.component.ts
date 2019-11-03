import {Component, OnInit, ViewChild} from '@angular/core';
import {Python3Service} from './langs/python3/python3.service';
import {JavaService} from './langs/java/java.service';
import {TypescriptService} from './langs/typescript/typescript.service';
import {LanguageService} from './langs/language-service';
import {CodemirrorComponent} from './codemirror/codemirror.component';
import {ParseTree} from 'antlr4ts/tree';
import {Ast} from './langs/ast';
import {MatDialog} from '@angular/material';
import {TreesComponent} from './trees/trees.component';
import {GifComponent} from './gif/gif.component';
import {AboutComponent} from './about/about.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  sourceLanguage: LanguageInfo;
  targetLanguage: LanguageInfo;

  @ViewChild('source', {static: true}) source: CodemirrorComponent;
  @ViewChild('target', {static: true}) target: CodemirrorComponent;

  antlrTree: ParseTree;
  ast: Ast;

  languages: {[name: string]: LanguageInfo} = {
    python3: {name: 'Python 3', mode: 'text/x-python', service: this.python3},
    java: {name: 'Java', mode: 'text/x-java', service: this.java},
    typeScript: {name: 'TypeScript', mode: 'text/typescript', service: this.typescript}
  };

  constructor(private python3: Python3Service, private java: JavaService, private typescript: TypescriptService, private dialog: MatDialog) {}

  ngOnInit() {
    this.sourceLanguage = this.languageValues[0];
    this.targetLanguage = this.languageValues[1];

    // this.source.writeValue('a = 10\n');
    //
    // const pythonCode = `if a > b:
    //   c = d + e
    //   j = j+k
    //   print(10)
    // else:
    //   k = 10
    //   c = a and b
    //   print(100, b)`;
    // const javaCode = `println(1 + 2 * 3);`;
    // const typescriptCode = `log(1 + 2 * 3)`;
    //
    // const pythonAst = this.python3.convertAntlrToAst(this.python3.convertCodeToAntlr(pythonCode));
    // const javaAst = this.java.convertAntlrToAst(this.java.convertCodeToAntlr(javaCode));
    // const tsAst = this.typescript.convertAntlrToAst(this.typescript.convertCodeToAntlr(typescriptCode));
    //
    // console.log('Python:');
    // console.log(pythonAst);
    // console.log(this.java.convertAstToCode(pythonAst));
    // console.log();
    //
    // console.log('Java:');
    // console.log(javaAst);
    // console.log(this.java.convertAstToCode(javaAst));
    // console.log();
    //
    // console.log('TypeScript:');
    // console.log(tsAst);
    // console.log();
  }

  get languageValues() {
    return Object.values(this.languages);
  }

  sourceChange() {
    this.source.instance.setOption('mode', this.sourceLanguage.mode);
  }

  targetChange() {
    this.target.instance.setOption('mode', this.targetLanguage.mode);
  }

  translate() {
    const ref = this.dialog.open(GifComponent, {
      data: {
        from: this.sourceLanguage.name.toLowerCase(),
        to: this.targetLanguage.name.toLowerCase()
      }
    });

    setTimeout(() => {
      this.antlrTree = this.sourceLanguage.service.convertCodeToAntlr(this.source.value);
      this.ast = this.sourceLanguage.service.convertAntlrToAst(this.antlrTree);
      this.target.writeValue(this.targetLanguage.service.convertAstToCode(this.ast));
      ref.close();
    }, 1500);
  }

  showTrees() {
    this.dialog.open(TreesComponent, {
      width: '100vw',
      height: '100vh',
      data: {
        antlrTree: this.antlrTree,
        ast: this.ast
      }
    });
  }

  about() {
    this.dialog.open(AboutComponent);
  }
}

interface LanguageInfo {
  name: string;
  mode: string;
  service: LanguageService<any>;
}
