import * as ts from 'typescript';
import * as vscode from 'vscode';
import { ASTFunctionDeclaration } from '../../ast/nodes/ast-function-declaration';
import { ASTMethodDeclaration } from '../../ast/nodes/ast-method-declaration';
import { ASTRoot } from '../../ast/nodes/ast-root';
import { RefactorCommand } from '../abstractions/refactor.command';
import { tryExecute } from '../command.utils';
async function removeExplicitReturnType() {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (!activeTextEditor) {
        return;
    }
    const { document, selection } = activeTextEditor;
    const { source, node: nodeToRefactor } = getSourceAndNodeAtSelection(
        document,
        selection
    );
    if (
        !nodeToRefactor?.name ||
        !nodeToRefactor?.body ||
        !nodeToRefactor?.type
    ) {
        return;
    }
    let createNodeWithoutType = () => {
        if (ts.isFunctionDeclaration(nodeToRefactor)) {
            return ts.factory.updateFunctionDeclaration(
                nodeToRefactor,
                nodeToRefactor.modifiers,
                nodeToRefactor.asteriskToken,
                nodeToRefactor.name,
                undefined,
                nodeToRefactor.parameters,
                undefined,
                nodeToRefactor.body
            );
        } else if (ts.isMethodDeclaration(nodeToRefactor)) {
            return ts.factory.updateMethodDeclaration(
                nodeToRefactor,
                nodeToRefactor.modifiers,
                nodeToRefactor.asteriskToken,
                nodeToRefactor.name,
                nodeToRefactor.questionToken,
                undefined,
                nodeToRefactor.parameters,
                undefined,
                nodeToRefactor.body
            );
        }
        return nodeToRefactor;
    };

    var replaceNodeWithArrowSyntax: ts.TransformerFactory<ts.Node> = (
        context: ts.TransformationContext
    ) => {
        function visit(node: ts.Node): ts.Node {
            if (node === nodeToRefactor) {
                return createNodeWithoutType();
            } else {
                node = ts.visitEachChild(node, visit, context);
                return node;
            }
        }

        return startNode => ts.visitNode(startNode, visit);
    };

    var transformed = ts.transform(source, [replaceNodeWithArrowSyntax]);

    const transformedFileContent = ts
        .createPrinter()
        .printNode(
            ts.EmitHint.Unspecified,
            createNodeWithoutType(),
            transformed.transformed[0].getSourceFile()
        );
    const edit = new vscode.WorkspaceEdit();
    var startOfMethodName = source.getLineAndCharacterOfPosition(
        nodeToRefactor.getStart(source)
    );
    var endOfMethodName = source.getLineAndCharacterOfPosition(
        nodeToRefactor.getEnd()
    );
    const replaceExact = new vscode.Range(
        new vscode.Position(
            startOfMethodName.line,
            startOfMethodName.character
        ),
        new vscode.Position(endOfMethodName.line, endOfMethodName.character)
    );
    edit.set(document.uri, [
        new vscode.TextEdit(replaceExact, transformedFileContent),
    ]);
    await vscode.workspace.applyEdit(edit);
}

function createModifierFromNode(
    node: ts.MethodDeclaration | ts.FunctionDeclaration
) {
    if (ts.isMethodDeclaration(node)) {
        return node.modifiers ? [...node.modifiers] : [];
    }

    return ts.factory.createModifiersFromModifierFlags(ts.ModifierFlags.Const);
}

function getSourceAndNodeAtSelection(
    document: vscode.TextDocument,
    selection: vscode.Selection
): {
    source: ts.SourceFile;
    node?: ts.MethodDeclaration | ts.FunctionDeclaration;
} {
    var root = new ASTRoot(document);
    var methodDeclaration = new ASTMethodDeclaration(root, selection);
    let node: ts.MethodDeclaration | ts.FunctionDeclaration | undefined =
        methodDeclaration.getNode();
    if (!node) {
        var functionDeclaration = new ASTFunctionDeclaration(root, selection);
        node = functionDeclaration.getNode();
    }
    return { source: root.sourceFile, node };
}

const removeExplicitReturnTypeCommand: RefactorCommand = {
    name: `refactor-this.remove-explicit-return-type`,
    title: `[RThis] Remove explicit return type`,
    kind: vscode.CodeActionKind.RefactorRewrite,
    command: async () => {
        await tryExecute(removeExplicitReturnTypeCommand, () =>
            removeExplicitReturnType()
        );
    },
    canBePerformed: (
        document: vscode.TextDocument,
        selection: vscode.Selection
    ) => {
        const { node } = getSourceAndNodeAtSelection(document, selection);
        const nodeExists = !!node;
        const hasType = !!node?.type;
        return nodeExists && hasType;
    },
};

export { removeExplicitReturnTypeCommand };
