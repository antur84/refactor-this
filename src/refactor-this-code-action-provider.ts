import * as vscode from "vscode";
import { RefactorCommand } from "./commands/func-to-arrow/abstractions/refactor.command";

export class RefactorThisCodeActionProvider
  implements vscode.CodeActionProvider {
  constructor(private refactorCommands: RefactorCommand[]) {}

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
    return this.refactorCommands.map(command => {
      var action = new vscode.CodeAction(command.title, command.kind);

      action.command = {
        command: command.name,
        title: command.title,
        tooltip: command.tooltip
      };

      return action;
    });
  }
}
