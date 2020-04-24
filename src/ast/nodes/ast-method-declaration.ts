import { MethodDeclaration, Node } from 'typescript';
import { Selection } from 'vscode';
import { ASTNode } from '../abstractions/ast-node';
import { findMethodDeclarationAtSelection } from '../ast.utils';

export class ASTMethodDeclaration implements ASTNode<MethodDeclaration> {
  constructor(private astNode: ASTNode<Node>, private selection: Selection) {}

  getNode(): MethodDeclaration {
    const node = this.astNode.getNode();
    return findMethodDeclarationAtSelection(
      node,
      this.selection,
      node.getSourceFile()
    );
  }
}
