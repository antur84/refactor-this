import * as vscode from 'vscode';
import { logToOutput } from '../logger';
import { RefactorCommand } from './abstractions/refactor.command';
export async function tryExecute(
    command: RefactorCommand,
    action: () => Promise<any>
): Promise<void> {
    try {
        await action();
    } catch (err: unknown) {
        if (hasName(err) && err.name === 'Canceled') {
            return;
        }

        const message = `Error performing '${command.title}.`;
        vscode.window.showErrorMessage(message);
        logToOutput(message);
        if (typeof err === 'string') {
            logToOutput(err);
        }
    }
}

const hasName = (obj: any): obj is { name: string } => {
    return obj && typeof obj.name === 'string';
};
