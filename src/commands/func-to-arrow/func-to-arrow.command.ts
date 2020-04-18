import { CodeActionKind, Selection, TextDocument, window } from 'vscode';
import { ASTParser } from '../../ast/ast-parser';
import { findMethodDeclarationAtSelection } from '../../ast/locators/method-declaration-locator';
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
    findMethodDeclarationAtSelection(src, selection, src)
  );
  if (!node) {
    return;
  }
  window.showInformationMessage('do magic!', { modal: false });
}

async function canBePerformed(document: TextDocument, selection: Selection) {
  var parser = new ASTParser(document);
  return !!parser.getNode(src =>
    findMethodDeclarationAtSelection(src, selection, src)
  );
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
