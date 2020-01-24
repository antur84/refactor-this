import * as vscode from 'vscode';
import { tryExecute } from '../command.utils';
import { RefactorCommand } from './abstractions/refactor.command';

async function funcToArrow() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) {
    return;
  }

  const { document, selection } = activeTextEditor;

  await vscode.commands.executeCommand("editor.action.rename");
}


const funcToArrowCommand: RefactorCommand = {
    name: `refactorthis.func-to-arrow`,
    title: `RThis: Convert to arrow function (=>)`,
    kind: vscode.CodeActionKind.RefactorRewrite,
    command: async () => {
      await tryExecute(() => funcToArrow());
    }
  };

export { funcToArrowCommand };

