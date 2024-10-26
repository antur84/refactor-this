import * as vscode from 'vscode';
export interface RefactorCommand {
    canBePerformed(
        document: vscode.TextDocument,
        selection: vscode.Selection
    ): boolean;
    name: string;
    command: () => Promise<void>;
    kind: vscode.CodeActionKind;
    title: string;
    tooltip?: string;
}
