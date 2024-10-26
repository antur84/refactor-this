import * as ts from 'typescript';
import * as vscode from 'vscode';
import { ASTNode } from '../abstractions/ast-node';
import { findFunctionDeclarationAtSelection } from '../ast.utils';

export class ASTFunctionDeclaration implements ASTNode<ts.FunctionDeclaration> {
    constructor(
        private astNode: ASTNode<ts.Node>,
        private selection: vscode.Selection
    ) {}

    getNode(): ts.FunctionDeclaration {
        const node = this.astNode.getNode();
        return findFunctionDeclarationAtSelection(
            node,
            this.selection,
            node.getSourceFile()
        );
    }
}
