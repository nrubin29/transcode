import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatTabChangeEvent, MatTabGroup} from '@angular/material';
import {Ast} from '../langs/ast';
import {ParserRuleContext} from 'antlr4ts';
import {TerminalNode} from 'antlr4ts/tree';
import {TreantAstVisitor} from './treant-ast-visitor';

declare var Treant: any;

@Component({
  selector: 'app-trees',
  templateUrl: './trees.component.html',
  styleUrls: ['./trees.component.scss']
})
export class TreesComponent implements OnInit, AfterViewInit {
  antlrTree: ParserRuleContext;
  ast: Ast;

  antlrChart: any;
  astChart: any;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    this.antlrTree = this.data.antlrTree;
    this.ast = this.data.ast;
  }

  ngAfterViewInit() {
    this.tabChange({index: 0} as any);
  }

  tabChange(e: MatTabChangeEvent) {
    if (e.index === 0 && !this.antlrChart) {
      this.antlrChart = new Treant({
        chart: {
          container: '#antlr-tree'
        },
        nodeStructure: this.visit(this.antlrTree)
      });
    }

    else if (e.index === 1 && !this.astChart) {
      const visitor = new TreantAstVisitor();
      console.log(visitor.visit(this.ast.root));
      this.antlrChart = new Treant({
        chart: {
          container: '#ast-tree'
        },
        nodeStructure: visitor.visit(this.ast.root)
      });
    }
  }

  visit(node: ParserRuleContext) {
    console.log(node);

    if (node instanceof TerminalNode) {
      return {
        text: {name: node.text}
      };
    }

    else {
      return {
        text: {name: node.constructor.name},
        children: node.children.map(child => this.visit(child as ParserRuleContext))
      };
    }
  }
}
