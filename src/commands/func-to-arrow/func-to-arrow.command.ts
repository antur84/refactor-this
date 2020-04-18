import {
  createArrowFunction,
  createPrinter,
  createProperty,
  createToken,
  EmitHint,
  Node,
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
  window,
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

  var transformerFactory: TransformerFactory<Node> = (
    context: TransformationContext
  ) => {
    return rootNode => {
      function visit(node: Node): Node {
        node = visitEachChild(node, visit, context);

        if (node === nodeToRefactor) {
          const arrowFunc = createArrowFunction(
            nodeToRefactor.modifiers,
            nodeToRefactor.typeParameters,
            nodeToRefactor.parameters,
            nodeToRefactor.type,
            createToken(SyntaxKind.EqualsGreaterThanToken),
            nodeToRefactor.body
          );
          return createProperty(
            undefined,
            nodeToRefactor.modifiers,
            nodeToRefactor.name,
            undefined,
            nodeToRefactor.type,
            arrowFunc
          );
        } else {
          return node;
        }
      }

      return visitNode(rootNode, visit);
    };
  };
  const edit = new WorkspaceEdit();

  var transformed = transform(parser.sourceFile, [transformerFactory]);
  var startOfMethodName = parser.sourceFile.getLineAndCharacterOfPosition(
    nodeToRefactor.getStart(parser.sourceFile)
  );
  var endOfMethodName = parser.sourceFile.getLineAndCharacterOfPosition(
    nodeToRefactor.getEnd()
  );
  const replaceRange = new Range(
    new Position(startOfMethodName.line, startOfMethodName.character),
    new Position(endOfMethodName.line, endOfMethodName.character)
  );

  console.log(
    createPrinter().printNode(
      EmitHint.Unspecified,
      parser.sourceFile,
      undefined
    )
  );

  console.log(
    createPrinter().printNode(
      EmitHint.Unspecified,
      transformed.transformed[0],
      undefined
    )
  );

  // edit.set(document.uri, [
  //   new TextEdit(replaceRange, transformed.transformed[0].getText())
  // ]);

  // await workspace.applyEdit(edit);
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
