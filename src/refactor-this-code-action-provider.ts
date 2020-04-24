import * as vscode from 'vscode';
import { RefactorCommand } from './commands/abstractions/refactor.command';

export class RefactorThisCodeActionProvider
  implements vscode.CodeActionProvider {
  constructor(private refactorCommands: RefactorCommand[] = []) {}

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
    var result = new Promise<vscode.CodeAction[]>((resolve, reject) => {
      token.onCancellationRequested(() => reject());
      var selection = new vscode.Selection(range.start, range.end);
      var validCommands = this.refactorCommands
        .filter(command => !context.only || context.only.contains(command.kind))
        .filter(command => command.canBePerformed(document, selection))
        .map(command => {
          var action = new vscode.CodeAction(command.title, command.kind);
          action.command = {
            command: command.name,
            title: command.title,
            tooltip: command.tooltip
          };
          return action;
        });

      resolve(validCommands);
    });
    return result;
  }
}
