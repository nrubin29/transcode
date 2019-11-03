import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Ast} from '../langs/ast';
import {ParserRuleContext} from 'antlr4ts';

@Component({
  selector: 'app-trees',
  templateUrl: './trees.component.html',
  styleUrls: ['./trees.component.scss']
})
export class TreesComponent implements OnInit {
  antlrTree: ParserRuleContext;
  ast: Ast;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    this.antlrTree = this.data.antlrTree;
    this.ast = this.data.ast;
  }
}
