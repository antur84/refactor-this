import {
  createArrowFunction,
  createModifiersFromModifierFlags,
  createPrinter,
  createProperty,
  createToken,
  EmitHint,
  FunctionDeclaration,
  isMethodDeclaration,
  MethodDeclaration,
  Modifier,
  ModifierFlags,
  Node,
  PropertyDeclaration,
  SourceFile,
  SyntaxKind,
  transform,
  TransformationContext,
  TransformerFactory,
  visitEachChild,
  visitNode
} from 'typescript';
import {
  CodeActionKind,
  Position,
  Range,
  Selection,
  TextDocument,
  TextEdit,
  window,
  workspace,
  WorkspaceEdit
} from 'vscode';
import { ASTFunctionDeclaration } from '../../ast/ast-function-declaration';
import { ASTMethodDeclaration } from '../../ast/ast-method-declaration';
import { ASTRoot } from '../../ast/ast-root';
import { RefactorCommand } from '../abstractions/refactor.command';
import { tryExecute } from '../command.utils';
async function toArrowSyntax() {
  const activeTextEditor = window.activeTextEditor;
  if (!activeTextEditor) {
    return;
  }
  const { document, selection } = activeTextEditor;
  const { source, node: nodeToRefactor } = getSourceAndNodeAtSelection(
    document,
    selection
  );
  let propertyArrowFunction: PropertyDeclaration = createProperty(
    undefined,
    createModifierFromNode(nodeToRefactor),
    nodeToRefactor.name,
    undefined,
    nodeToRefactor.type,
    createArrowFunction(
      undefined,
      nodeToRefactor.typeParameters,
      nodeToRefactor.parameters,
      nodeToRefactor.type,
      createToken(SyntaxKind.EqualsGreaterThanToken),
      nodeToRefactor.body
    )
  );
  var replaceNodeWithArrowSyntax: TransformerFactory<Node> = (
    context: TransformationContext
  ) => {
    function visit(node: Node): Node {
      if (node === nodeToRefactor) {
        return propertyArrowFunction;
      } else {
        node = visitEachChild(node, visit, context);
        return node;
      }
    }

    return startNode => visitNode(startNode, visit);
  };

  var transformed = transform(source, [replaceNodeWithArrowSyntax]);

  const transformedFileContent = createPrinter().printNode(
    EmitHint.Unspecified,
    propertyArrowFunction,
    transformed.transformed[0].getSourceFile()
  );
  const edit = new WorkspaceEdit();
  var startOfMethodName = source.getLineAndCharacterOfPosition(
    nodeToRefactor.getStart(source)
  );
  var endOfMethodName = source.getLineAndCharacterOfPosition(
    nodeToRefactor.getEnd()
  );
  const replaceExact = new Range(
    new Position(startOfMethodName.line, startOfMethodName.character),
    new Position(endOfMethodName.line, endOfMethodName.character)
  );
  edit.set(document.uri, [new TextEdit(replaceExact, transformedFileContent)]);
  await workspace.applyEdit(edit);
}

function createModifierFromNode(
  node: MethodDeclaration | FunctionDeclaration
): Modifier[] {
  if (isMethodDeclaration(node)) {
    return node.modifiers ? [...node.modifiers] : [];
  }

  return createModifiersFromModifierFlags(ModifierFlags.Const);
}

function canBePerformed(document: TextDocument, selection: Selection) {
  return !!getSourceAndNodeAtSelection(document, selection).node;
}

function getSourceAndNodeAtSelection(
  document: TextDocument,
  selection: Selection
): { source: SourceFile; node?: MethodDeclaration | FunctionDeclaration } {
  var root = new ASTRoot(document);
  var methodDeclarationParser = new ASTMethodDeclaration(root, selection);
  let node:
    | MethodDeclaration
    | FunctionDeclaration = methodDeclarationParser.getNode();
  if (!node) {
    var functionDeclarationParser = new ASTFunctionDeclaration(root, selection);
    node = functionDeclarationParser.getNode();
  }

  return { source: root.sourceFile, node };
}

const toArrowSyntaxCommand: RefactorCommand = {
  name: `refactorthis.to-arrow-syntax`,
  title: `[RThis] Convert to arrow syntax (=>)`,
  kind: CodeActionKind.RefactorRewrite,
  command: async () => {
    await tryExecute(toArrowSyntaxCommand, () => toArrowSyntax());
  },
  canBePerformed: canBePerformed
};

export { toArrowSyntaxCommand };
