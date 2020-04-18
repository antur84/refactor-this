import * as vscode from 'vscode';
export async function tryExecute(command: () => Promise<any>): Promise<void> {
  try {
    await command();
  } catch (err) {
    if (err.name === 'Canceled') {
      return;
    }

    vscode.window.showErrorMessage(`KABOOM: ${err.message}`);
    console.error(err);
  }
}
