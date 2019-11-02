/* tslint:disable */
import {CharStream, Lexer, Token} from "antlr4ts";

export abstract class TypeScriptBaseLexer extends Lexer {
    public static readonly OpenBracket = 4;
    public static readonly CloseBracket = 5;
    public static readonly CloseParen = 7;
    public static readonly OpenBrace = 8;
    public static readonly PlusPlus = 17;
    public static readonly MinusMinus = 18;
    public static readonly NullLiteral = 54;
    public static readonly BooleanLiteral = 55;
    public static readonly DecimalLiteral = 56;
    public static readonly HexIntegerLiteral = 57;
    public static readonly OctalIntegerLiteral = 58;
    public static readonly This = 79;
    public static readonly Identifier = 123;
    public static readonly StringLiteral = 124;



    private scopeStrictModes: boolean[] = [];
    private lastToken: Token;
    private useStrictDefault = false;
    private useStrictCurrent = false;

    constructor(stream: CharStream) {
        super(stream);
    }

    getStrictDefault(): boolean {
        return this.useStrictCurrent;
    }

    setUseStrictDefault(value: boolean): void {
        this.useStrictDefault = value;
        this.useStrictCurrent = value;
    }

    IsStrictMode(): boolean {
        return this.useStrictCurrent;
    }

    nextToken(): Token {
        const next = super.nextToken();

        if (next.channel === Token.DEFAULT_CHANNEL) {
            this.lastToken = next;
        }

        return next;
    }

    protected  ProcessOpenBrace(): void {
        const scopeLength = this.scopeStrictModes.length;
        this.useStrictCurrent = scopeLength > 0 && this.scopeStrictModes[scopeLength - 1] ? true : this.useStrictDefault;
        this.scopeStrictModes.push(this.useStrictCurrent);
    }

    protected  ProcessCloseBrace(): void {
        const scopeLength = this.scopeStrictModes.length;
        this.useStrictCurrent = scopeLength > 0 && this.scopeStrictModes[scopeLength - 1] ? this.scopeStrictModes.pop() : this.useStrictDefault;
    }

    protected ProcessStringLiteral(): void {
        if (!this.lastToken || this.lastToken.type === TypeScriptBaseLexer.OpenBrace) {
            if (this.text === "\"use strict\"" || this.text === "\'use strict\'") {
                if (this.scopeStrictModes.length > 0) {
                    this.scopeStrictModes.pop();
                }
                this.useStrictCurrent = true;
                this.scopeStrictModes.push(this.useStrictCurrent);
            }
        }
    }

    protected  IsRegexPossible(): boolean {
        if (!this.lastToken) {
            return true;
        }

        switch (this.lastToken.type) {
            case TypeScriptBaseLexer.Identifier:
            case TypeScriptBaseLexer.NullLiteral:
            case TypeScriptBaseLexer.BooleanLiteral:
            case TypeScriptBaseLexer.This:
            case TypeScriptBaseLexer.CloseBracket:
            case TypeScriptBaseLexer.CloseParen:
            case TypeScriptBaseLexer.OctalIntegerLiteral:
            case TypeScriptBaseLexer.DecimalLiteral:
            case TypeScriptBaseLexer.HexIntegerLiteral:
            case TypeScriptBaseLexer.StringLiteral:
            case TypeScriptBaseLexer.PlusPlus:
            case TypeScriptBaseLexer.MinusMinus:
                // After any of the tokens above, no regex literal can follow.
                return false;
            default:
                // In all other cases, a regex literal _is_ possible.
                return true;
        }

    }


}