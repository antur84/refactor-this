import { CodeActionKind, Selection, TextDocument, window } from 'vscode';
import { ASTMethodDeclaration } from '../../ast/ast-method-declaration';
import { ASTRoot } from '../../ast/ast-root';
import { tryExecute } from '../command.utils';
import { RefactorCommand } from './abstractions/refactor.command';

async function funcToArrow() {
  const activeTextEditor = window.activeTextEditor;
  if (!activeTextEditor) {
    return;
  }
  const { document, selection } = activeTextEditor;
  var parser = new ASTMethodDeclaration(new ASTRoot(document), selection);
  const result = parser.getNode();
  if (!result) {
    return;
  }
  window.showInformationMessage('do magic!', { modal: false });
}

function canBePerformed(document: TextDocument, selection: Selection) {
  var parser = new ASTMethodDeclaration(new ASTRoot(document), selection);
  var node = parser.getNode();
  return !!node;
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
