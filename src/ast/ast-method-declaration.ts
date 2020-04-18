import { isMethodDeclaration, Node, SourceFile } from 'typescript';
import { Selection } from 'vscode';
import { ASTNode } from './abstractions/ast-node';

export class ASTMethodDeclaration implements ASTNode {
  constructor(private astNode: ASTNode, private selection: Selection) {}
  sourceFile: SourceFile = this.astNode.sourceFile;

  getNode(): Node {
    const match = this.findMethodDeclarationAtSelection(
      this.astNode.getNode(),
      this.selection,
      this.sourceFile
    );
    return match;
  }

  private findMethodDeclarationAtSelection = (
    node: Node,
    selection: Selection,
    sourceFile: SourceFile
  ) => {
    if (isMethodDeclaration(node)) {
      var startOfMethodName = sourceFile.getLineAndCharacterOfPosition(
        node.name.getStart(sourceFile)
      );
      var endOfMethodName = sourceFile.getLineAndCharacterOfPosition(
        node.name.getEnd()
      );
      if (
        startOfMethodName.line === selection.start.line &&
        endOfMethodName.line === selection.end.line &&
        selection.start.character >= startOfMethodName.character &&
        selection.end.character <= endOfMethodName.character
      ) {
        return node;
      }
    }

    const children = node.getChildren(sourceFile) || [];
    let match: Node = null;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];
      match = this.findMethodDeclarationAtSelection(
        child,
        selection,
        sourceFile
      );
      if (match) {
        break;
      }
    }
    return match;
  };
}
