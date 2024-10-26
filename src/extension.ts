// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { toArrowSyntaxCommand } from "./commands/to-arrow-syntax/to-arrow-syntax.command";
import { RefactorThisCodeActionProvider } from "./refactor-this-code-action-provider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  [toArrowSyntaxCommand].forEach((refactorCommand) => {
    const { name, command } = refactorCommand;
    context.subscriptions.push(vscode.commands.registerCommand(name, command));

    context.subscriptions.push(
      vscode.languages.registerCodeActionsProvider(
        "typescript",
        new RefactorThisCodeActionProvider([refactorCommand])
      )
    );
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
