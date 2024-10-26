import * as ts from 'typescript';
import * as vscode from 'vscode';
import { ASTNode } from '../abstractions/ast-node';
import { findFunctionDeclarationAtSelection } from '../ast.utils';

export class ASTFunctionDeclaration implements ASTNode<ts.FunctionDeclaration> {
    constructor(
        private astNode: ASTNode<ts.Node>,
        private selection: vscode.Selection
    ) {}

    getNode() {
        const node = this.astNode.getNode();
        if (!node) {
            return node;
        }

        return findFunctionDeclarationAtSelection(
            node,
            this.selection,
            node.getSourceFile()
        );
    }
}
