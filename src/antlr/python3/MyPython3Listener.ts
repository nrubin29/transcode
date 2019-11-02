import {Python3Listener} from './Python3Listener';
import {Expr_stmtContext} from './Python3Parser';
import {ParseTreeListener, TerminalNode} from 'antlr4ts/tree';

export class MyPython3Listener implements Python3Listener {

  enterExpr_stmt(ctx: Expr_stmtContext) {
    console.log('expr_stmt', ctx);
    console.log(ctx.testlist_star_expr());
    console.log(ctx.getChild(1).text);
  }
}
