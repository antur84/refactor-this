import { isMethodDeclaration, Node, SourceFile } from 'typescript';
import { CodeActionKind, Selection, TextDocument, window } from 'vscode';
import { ASTParser } from '../../ast/ast';
import { tryExecute } from '../command.utils';
import { RefactorCommand } from './abstractions/refactor.command';

async function funcToArrow() {
  const activeTextEditor = window.activeTextEditor;
  if (!activeTextEditor) {
    return;
  }
  const { document, selection } = activeTextEditor;
  var parser = new ASTParser(document);
  const node = parser.getNode(src =>
    findMethodDeclaration(src, selection, src)
  );
  if (!node) {
    return;
  }
  window.showInformationMessage('do magic!', { modal: false });
}

async function canBePerformed(document: TextDocument, selection: Selection) {
  var parser = new ASTParser(document);
  return !!parser.getNode(src => findMethodDeclaration(src, selection, src));
}

const funcToArrowCommand: RefactorCommand = {
  name: `refactorthis.func-to-arrow`,
  title: `RThis: Convert to arrow function (=>)`,
  kind: CodeActionKind.RefactorRewrite,
  command: async () => {
    await tryExecute(() => funcToArrow());
  },
  canBePerformed: canBePerformed
};

export { funcToArrowCommand };

function findMethodDeclaration(
  node: Node,
  selection: Selection,
  sourceFile: SourceFile
): Node {
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
    match = findMethodDeclaration(child, selection, sourceFile);
    if (match) {
      break;
    }
  }
  return match;
}
