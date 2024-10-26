import * as ts from 'typescript';
import * as vscode from 'vscode';
import { ASTNode } from '../abstractions/ast-node';

export class ASTRoot implements ASTNode<ts.Node> {
    constructor(private document: vscode.TextDocument) {}

    private _sourceFile: ts.SourceFile;

    get sourceFile() {
        if (!this._sourceFile) {
            this._sourceFile = this.getSourceFile();
        }
        return this._sourceFile;
    }

    private getSourceFile() {
        var sourceFile = ts.createSourceFile(
            this.document.fileName,
            this.document.getText(),
            ts.ScriptTarget.Latest
        );
        return sourceFile;
    }

    getNode(): ts.Node {
        return this.sourceFile;
    }
}
