import {
  FunctionDeclaration,
  isFunctionDeclaration,
  Node,
  SourceFile
} from 'typescript';
import { Selection } from 'vscode';
import { ASTNode } from './abstractions/ast-node';

export class ASTFunctionDeclaration implements ASTNode {
  constructor(private astNode: ASTNode, private selection: Selection) {}
  sourceFile: SourceFile = this.astNode.sourceFile;

  getNode(): FunctionDeclaration {
    const match = this.findFunctionDeclarationAtSelection(
      this.astNode.getNode(),
      this.selection,
      this.sourceFile
    );
    return match as FunctionDeclaration;
  }

  private findFunctionDeclarationAtSelection = (
    node: Node,
    selection: Selection,
    sourceFile: SourceFile
  ) => {
    if (isFunctionDeclaration(node)) {
      var startOfDeclarationName = sourceFile.getLineAndCharacterOfPosition(
        node.name.getStart(sourceFile)
      );
      var endOfDeclarationName = sourceFile.getLineAndCharacterOfPosition(
        node.name.getEnd()
      );
      if (
        startOfDeclarationName.line === selection.start.line &&
        endOfDeclarationName.line === selection.end.line &&
        selection.start.character >= startOfDeclarationName.character &&
        selection.end.character <= endOfDeclarationName.character
      ) {
        return node;
      }
    }

    const children = node.getChildren(sourceFile) || [];
    let match: Node = null;
    for (let index = 0; index < children.length; index++) {
      const child = children[index];
      match = this.findFunctionDeclarationAtSelection(
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
