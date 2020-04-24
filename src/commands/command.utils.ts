import * as vscode from 'vscode';
import { logToOutput } from '../logger';
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

    const message = `Error performing '${command.title}.`;
    vscode.window.showErrorMessage(message);
    logToOutput(message);
    logToOutput(err);
  }
}
