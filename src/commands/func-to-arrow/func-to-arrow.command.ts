import {
  createArrowFunction,
  createPrinter,
  createProperty,
  createToken,
  EmitHint,
  Node,
  PropertyDeclaration,
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
import { ASTMethodDeclaration } from '../../ast/ast-method-declaration';
import { ASTRoot } from '../../ast/ast-root';
import { tryExecute } from '../command.utils';
import { RefactorCommand } from './abstractions/refactor.command';

async function funcToArrow() {
  const activeTextEditor = window.activeTextEditor;
  if (!activeTextEditor) {
    return;
  }
  const { document, selection } = activeTextEditor;
  var parser = new ASTMethodDeclaration(new ASTRoot(document), selection);
  const nodeToRefactor = parser.getNode();
  if (!nodeToRefactor) {
    return;
  }

  let propertyArrowFunction: PropertyDeclaration = createProperty(
    undefined,
    nodeToRefactor.modifiers,
    nodeToRefactor.name,
    undefined,
    nodeToRefactor.type,
    createArrowFunction(
      nodeToRefactor.modifiers,
      nodeToRefactor.typeParameters,
      nodeToRefactor.parameters,
      nodeToRefactor.type,
      createToken(SyntaxKind.EqualsGreaterThanToken),
      nodeToRefactor.body
    )
  );
  var replaceNodeWithArrowFunction: TransformerFactory<Node> = (
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

  var transformed = transform(parser.sourceFile, [
    replaceNodeWithArrowFunction
  ]);

  const transformedFileContent = createPrinter().printNode(
    EmitHint.Unspecified,
    propertyArrowFunction,
    transformed.transformed[0].getSourceFile()
  );
  const edit = new WorkspaceEdit();
  var startOfMethodName = parser.sourceFile.getLineAndCharacterOfPosition(
    nodeToRefactor.getStart(parser.sourceFile)
  );
  var endOfMethodName = parser.sourceFile.getLineAndCharacterOfPosition(
    nodeToRefactor.getEnd()
  );
  const replaceExact = new Range(
    new Position(startOfMethodName.line, startOfMethodName.character),
    new Position(endOfMethodName.line, endOfMethodName.character)
  );
  edit.set(document.uri, [new TextEdit(replaceExact, transformedFileContent)]);
  await workspace.applyEdit(edit);
}

function canBePerformed(document: TextDocument, selection: Selection) {
  var parser = new ASTMethodDeclaration(new ASTRoot(document), selection);
  var node = parser.getNode();
  return !!node;
}

const funcToArrowCommand: RefactorCommand = {
  name: `refactorthis.func-to-arrow`,
  title: `RThis: Convert to arrow function (=>)`,
  kind: CodeActionKind.RefactorRewrite,
  command: async () => {
    await tryExecute(() => funcToArrow());
  },
  canBePerformed: canBePerformed
};

export { funcToArrowCommand };
