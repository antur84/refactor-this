import * as ts from 'typescript';
import * as vscode from 'vscode';
export const findAtSelection = <T extends ts.FunctionLikeDeclarationBase>(
    node: ts.Node,
    selection: vscode.Selection,
    sourceFile: ts.SourceFile,
    matcher: (node: ts.Node) => node is T
): T | undefined => {
    if (matcher(node) && node.name) {
        var startOfMethodName = sourceFile.getLineAndCharacterOfPosition(
            node.name.getStart(sourceFile)
        );
        var endOfMethodName = sourceFile.getLineAndCharacterOfPosition(
            node.name.getEnd()
        );
        if (
            startOfMethodName.line === selection.start.line &&
            endOfMethodName.line === selection.end.line &&
            selection.start.character >= startOfMethodName.character &&
            selection.end.character <= endOfMethodName.character
        ) {
            return node;
        }
    }

    const children = node.getChildren(sourceFile) || [];
    let match: T | undefined = undefined;
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        match = findAtSelection(child, selection, sourceFile, matcher);
        if (match) {
            break;
        }
    }
    return match;
};

export const findMethodDeclarationAtSelection = (
    node: ts.Node,
    selection: vscode.Selection,
    sourceFile: ts.SourceFile
) => findAtSelection(node, selection, sourceFile, ts.isMethodDeclaration);

export const findFunctionDeclarationAtSelection = (
    node: ts.Node,
    selection: vscode.Selection,
    sourceFile: ts.SourceFile
) => findAtSelection(node, selection, sourceFile, ts.isFunctionDeclaration);
