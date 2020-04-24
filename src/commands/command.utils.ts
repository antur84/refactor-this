import * as vscode from 'vscode';
import { RefactorCommand } from './abstractions/refactor.command';
export async function tryExecute(
  command: RefactorCommand,
  action: () => Promise<any>
): Promise<void> {
  try {
    await action();
  } catch (err) {
    if (err.name === 'Canceled') {
      return;
    }

    vscode.window.showErrorMessage(`Error performing '${command.title}.`);
    console.error(err);
  }
}
