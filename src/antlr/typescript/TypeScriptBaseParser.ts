/* tslint:disable */

import {Lexer, Parser, TokenStream} from "antlr4ts";

export abstract class TypeScriptBaseParser extends Parser {
    public static readonly MultiLineComment = 1;
    public static readonly OpenBrace = 8;
    public static readonly CloseBrace = 9;
    public static readonly Function = 78;
    public static readonly WhiteSpaces = 126;
    public static readonly LineTerminator = 127;


    constructor(stream: TokenStream) {
        super(stream);
    }

    protected p(str: string): boolean {
        return this.prev(str);
    }

    protected prev(str: string): boolean {
        return this._input.LT(-1).text === str;
    }

    protected n(str: string): boolean {
        return this.next(str);
    }

    protected next(str: string): boolean {
        return this._input.LT(-1).text === str;
    }

    protected notLineTerminator(): boolean {
        return !this.here(TypeScriptBaseParser.LineTerminator);
    }

    protected notOpenBraceAndNotFunction(): boolean {
        const nextTokenType = this._input.LT(1).type;
        return nextTokenType != TypeScriptBaseParser.OpenBrace && nextTokenType != TypeScriptBaseParser.Function;
    }

    protected closeBrace(): boolean {
        return this._input.LT(1).type === TypeScriptBaseParser.CloseBrace;
    }

    private here(type: number): boolean {
        const possibleIndexEosToken = this.currentToken.tokenIndex - 1;
        let ahead = this._input.get(possibleIndexEosToken);

        return (ahead.channel === Lexer.HIDDEN) && (ahead.type === type);
    }

    protected lineTerminatorAhead(): boolean {
        let possibleIndexEosToken = this.currentToken.tokenIndex - 1;
        let ahead = this._input.get(possibleIndexEosToken);

        if (ahead.channel != Lexer.HIDDEN) {
            return false;
        }

        if (ahead.type === TypeScriptBaseParser.LineTerminator) {
            return true;
        }

        if (ahead.type === TypeScriptBaseParser.WhiteSpaces) {
            possibleIndexEosToken = this.currentToken.tokenIndex - 2;
            ahead = this._input.get(possibleIndexEosToken);
        }

        const text = ahead.text;
        const type = ahead.type;

        return (type === TypeScriptBaseParser.MultiLineComment && (text.indexOf('\r') !== -1 || text.indexOf('\n') !== -1)) ||
            (type === TypeScriptBaseParser.LineTerminator);
    }

}
