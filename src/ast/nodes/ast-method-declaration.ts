import * as ts from 'typescript';
import * as vscode from 'vscode';
import { ASTNode } from '../abstractions/ast-node';
import { findMethodDeclarationAtSelection } from '../ast.utils';

export class ASTMethodDeclaration implements ASTNode<ts.MethodDeclaration> {
    constructor(
        private astNode: ASTNode<ts.Node>,
        private selection: vscode.Selection
    ) {}

    getNode() {
        const node = this.astNode.getNode();
        if (!node) {
            return node;
        }
        return findMethodDeclarationAtSelection(
            node,
            this.selection,
            node.getSourceFile()
        );
    }
}
