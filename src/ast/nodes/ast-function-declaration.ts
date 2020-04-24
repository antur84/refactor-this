import { FunctionDeclaration, Node } from 'typescript';
import { Selection } from 'vscode';
import { ASTNode } from '../abstractions/ast-node';
import { findFunctionDeclarationAtSelection } from '../ast.utils';

export class ASTFunctionDeclaration implements ASTNode<FunctionDeclaration> {
  constructor(private astNode: ASTNode<Node>, private selection: Selection) {}

  getNode(): FunctionDeclaration {
    const node = this.astNode.getNode();
    return findFunctionDeclarationAtSelection(
      node,
      this.selection,
      node.getSourceFile()
    );
  }
}
