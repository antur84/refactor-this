import * as vscode from 'vscode';

let logChannel: vscode.OutputChannel = vscode.window.createOutputChannel(
  'RefactorThis'
);

export const logToOutput = (message: string) => {
  logChannel.appendLine(message);
};
