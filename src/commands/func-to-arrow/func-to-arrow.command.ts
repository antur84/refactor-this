import * as ts from 'typescript';
import * as vscode from 'vscode';
import { tryExecute } from '../command.utils';
import { RefactorCommand } from './abstractions/refactor.command';

async function funcToArrow() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) {
    return;
  }

  const { document, selection } = activeTextEditor;
  var sourceFile = ts.createSourceFile(
    document.fileName,
    document.getText(),
    ts.ScriptTarget.Latest
  );

  const node = findNodeFromSelection(sourceFile, selection, sourceFile);
  if (!node) {
    return;
  }

  vscode.window.showInformationMessage('do magic!', { modal: false });
}

async function canBePerformed(
  document: vscode.TextDocument,
  selection: vscode.Selection
) {
  var sourceFile = ts.createSourceFile(
    document.fileName,
    document.getText(),
    ts.ScriptTarget.Latest
  );
  const validNode = findNodeFromSelection(sourceFile, selection, sourceFile);
  return !!validNode;
}

const funcToArrowCommand: RefactorCommand = {
  name: `refactorthis.func-to-arrow`,
  title: `RThis: Convert to arrow function (=>)`,
  kind: vscode.CodeActionKind.RefactorRewrite,
  command: async () => {
    await tryExecute(() => funcToArrow());
  },
  canBePerformed: canBePerformed
};

export { funcToArrowCommand };

function findNodeFromSelection(
  node: ts.Node,
  selection: vscode.Selection,
  sourceFile: ts.SourceFile
): ts.Node {
  if (ts.isMethodDeclaration(node)) {
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
  let match: ts.Node = null;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    match = findNodeFromSelection(child, selection, sourceFile);
    if (match) {
      break;
    }
  }
  return match;
}
