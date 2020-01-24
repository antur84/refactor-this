import * as vscode from "vscode";
import { funcToArrowCommand } from "./commands/func-to-arrow/func-to-arrow.command";
import { RefactorThisCodeActionProvider } from "./refactor-this-code-action-provider";

export function activate(context: vscode.ExtensionContext) {
  [funcToArrowCommand].forEach(command => {
    context.subscriptions.push(
      vscode.commands.registerCommand(command.name, command.command)
    );
  });

  [funcToArrowCommand].forEach(command => {
    context.subscriptions.push(
      vscode.languages.registerCodeActionsProvider(
        "typescript",
        new RefactorThisCodeActionProvider([command])
      )
    );
  });
}

export function deactivate() {}
