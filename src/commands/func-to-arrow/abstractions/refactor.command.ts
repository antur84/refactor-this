import * as vscode from 'vscode';
export interface RefactorCommand {
  name: string;
  command: () => Promise<void>;
  kind: vscode.CodeActionKind;
  title: string;
  tooltip?: string;
}
