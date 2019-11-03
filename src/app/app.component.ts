import {Component, OnInit} from '@angular/core';
import {Python3Service} from './langs/python3/python3.service';
import {JavaService} from './langs/java/java.service';
import {TypescriptService} from './langs/typescript/typescript.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private python3: Python3Service, private java: JavaService, private typescript: TypescriptService) {}

  ngOnInit() {
    const pythonCode = `print(1 + 2 * 3)
`;
    const javaCode = `println(1 + 2 * 3);`;
    const typescriptCode = `log(1 + 2 * 3)`;

    const pythonAst = this.python3.convertAntlrToAst(this.python3.convertCodeToAntlr(pythonCode));
    const javaAst = this.java.convertAntlrToAst(this.java.convertCodeToAntlr(javaCode));
    const tsAst = this.typescript.convertAntlrToAst(this.typescript.convertCodeToAntlr(typescriptCode));

    console.log('Python:');
    console.log(pythonAst);
    console.log();

    console.log('Java:');
    console.log(javaAst);
    console.log(this.java.convertAstToCode(javaAst));
    console.log();

    console.log('TypeScript:');
    console.log(tsAst);
    console.log();
  }
}
