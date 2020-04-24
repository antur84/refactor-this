import ts from 'typescript';
import * as vscode from 'vscode';
import { ASTNode } from '../abstractions/ast-node';
import { findMethodDeclarationAtSelection } from '../ast.utils';

export class ASTMethodDeclaration implements ASTNode<ts.MethodDeclaration> {
  constructor(
    private astNode: ASTNode<ts.Node>,
    private selection: vscode.Selection
  ) {}

  getNode(): ts.MethodDeclaration {
    const node = this.astNode.getNode();
    return findMethodDeclarationAtSelection(
      node,
      this.selection,
      node.getSourceFile()
    );
  }
}
