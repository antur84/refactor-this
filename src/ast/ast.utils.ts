import {
  FunctionLikeDeclarationBase,
  isFunctionDeclaration,
  isMethodDeclaration,
  Node,
  SourceFile
} from 'typescript';
import { Selection } from 'vscode';

export const findAtSelection = <T extends FunctionLikeDeclarationBase>(
  node: Node,
  selection: Selection,
  sourceFile: SourceFile,
  matcher: (node: Node) => node is T
): T => {
  if (matcher(node)) {
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
  let match: T = null;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    match = findAtSelection(child, selection, sourceFile, matcher);
    if (match) {
      break;
    }
  }
  return match;
};

export const findMethodDeclarationAtSelection = (
  node: Node,
  selection: Selection,
  sourceFile: SourceFile
) => findAtSelection(node, selection, sourceFile, isMethodDeclaration);

export const findFunctionDeclarationAtSelection = (
  node: Node,
  selection: Selection,
  sourceFile: SourceFile
) => findAtSelection(node, selection, sourceFile, isFunctionDeclaration);
