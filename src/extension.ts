import * as vscode from 'vscode';
import { toArrowSyntaxCommand } from './commands/to-arrow-syntax/to-arrow-syntax.command';
import { RefactorThisCodeActionProvider } from './refactor-this-code-action-provider';

export function activate(context: vscode.ExtensionContext) {
  [toArrowSyntaxCommand].forEach(command => {
    context.subscriptions.push(
      vscode.commands.registerCommand(command.name, command.command)
    );
  });

  [toArrowSyntaxCommand].forEach(command => {
    context.subscriptions.push(
      vscode.languages.registerCodeActionsProvider(
        'typescript',
        new RefactorThisCodeActionProvider([command])
      )
    );
  });
}

export function deactivate() {}
