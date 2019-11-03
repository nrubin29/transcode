import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatTreeNestedDataSource} from '@angular/material';
import {ParseTree} from 'antlr4ts/tree';
import {Ast, AtomNode, Node} from '../langs/ast';
import {NestedTreeControl} from '@angular/cdk/tree';
import {ParserRuleContext} from 'antlr4ts';
import {ChildrenAstVisitor} from './children-ast-visitor';

@Component({
  selector: 'app-trees',
  templateUrl: './trees.component.html',
  styleUrls: ['./trees.component.scss']
})
export class TreesComponent implements OnInit {
  // antlrTree: ParseTree;
  antlrTreeControl = new NestedTreeControl<ParserRuleContext>(node => node.children as ParserRuleContext[]);
  antlrTreeDataSource = new MatTreeNestedDataSource<ParserRuleContext>();

  // ast: Ast;
  childrenAstVisitor = new ChildrenAstVisitor();
  astControl = new NestedTreeControl<Node>(node => this.childrenAstVisitor.visit(node));
  astDataSource = new MatTreeNestedDataSource<Node>();

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    // this.antlrTree = this.data.antlrTree;
    // this.ast = this.data.ast;

    // this.antlrTreeDataSource.data = [this.data.antlrTree];
    this.astDataSource.data = [this.data.ast.root];
  }

  antlrTreeNodeHasChild(_: number, node: ParserRuleContext) {
    return node.childCount > 0;
  }

  astNodeHasChild(_: number, node: Node) {
    if (!this.childrenAstVisitor) {
      this.childrenAstVisitor = new ChildrenAstVisitor();
    }

    console.log('has child?', node);

    if (node instanceof AtomNode) {
      return false;
    }

    console.log(this.childrenAstVisitor.visit(node));

    return this.childrenAstVisitor.visit(node).length > 0;
  }

  str(o: any) {
    return JSON.stringify(o);
  }
}
