import * as ts from 'typescript';
import * as vscode from 'vscode';
import { ASTFunctionDeclaration } from '../../ast/nodes/ast-function-declaration';
import { ASTMethodDeclaration } from '../../ast/nodes/ast-method-declaration';
import { ASTRoot } from '../../ast/nodes/ast-root';
import { RefactorCommand } from '../abstractions/refactor.command';
import { tryExecute } from '../command.utils';
async function toArrowSyntax() {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (!activeTextEditor) {
        return;
    }
    const { document, selection } = activeTextEditor;
    const { source, node: nodeToRefactor } = getSourceAndNodeAtSelection(
        document,
        selection
    );
    if (!nodeToRefactor?.name || !nodeToRefactor?.body) {
        return;
    }
    let propertyArrowFunction: ts.PropertyDeclaration =
        ts.factory.createPropertyDeclaration(
            createModifierFromNode(nodeToRefactor),
            nodeToRefactor.name,
            undefined,
            nodeToRefactor.type,
            ts.factory.createArrowFunction(
                undefined,
                nodeToRefactor.typeParameters,
                nodeToRefactor.parameters,
                nodeToRefactor.type,
                ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                nodeToRefactor.body
            )
        );
    var replaceNodeWithArrowSyntax: ts.TransformerFactory<ts.Node> = (
        context: ts.TransformationContext
    ) => {
        function visit(node: ts.Node): ts.Node {
            if (node === nodeToRefactor) {
                return propertyArrowFunction;
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
            propertyArrowFunction,
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

const toArrowSyntaxCommand: RefactorCommand = {
    name: `refactor-this.to-arrow-syntax`,
    title: `[RThis] Convert to arrow syntax (=>)`,
    kind: vscode.CodeActionKind.RefactorRewrite,
    command: async () => {
        await tryExecute(toArrowSyntaxCommand, () => toArrowSyntax());
    },
    canBePerformed: (
        document: vscode.TextDocument,
        selection: vscode.Selection
    ) => !!getSourceAndNodeAtSelection(document, selection).node,
};

export { toArrowSyntaxCommand };
