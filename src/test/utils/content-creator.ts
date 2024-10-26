import * as vscode from 'vscode';
export const createEditorForContent = async (content: string) => {
    const document = await vscode.workspace.openTextDocument({
        content,
        language: 'typescript',
    });
    const editor = await vscode.window.showTextDocument(document);
    return { document, editor };
};
