import { expect } from 'chai';
import * as vscode from 'vscode';
import { toArrowSyntaxCommand } from '../../../../commands/to-arrow-syntax/to-arrow-syntax.command';
import { createEditorForContent } from '../../../utils/content-creator';
describe('to-arrow-syntax Test Suite', () => {
  it('should handle function declaration', async () => {
    const { editor, document } = await createEditorForContent(
      `function funcDeclaration() {
        var test = new FuncToArrowExample();
        test.simpleMethod();
      }`
    );
    editor.selection = new vscode.Selection(0, 10, 0, 10);

    expect(document.getText()).contain(`function funcDeclaration() {`);

    vscode.commands.executeCommand(toArrowSyntaxCommand.name).then(() => {
      expect(document.getText()).contain(`const funcDeclaration = () => {`);
    });
  });

  it('should handle method declaration', async () => {
    const { editor, document } = await createEditorForContent(
      `class Test {
        methodDeclaration() {
          var test = new FuncToArrowExample();
          test.simpleMethod();
        }
      }`
    );
    editor.selection = new vscode.Selection(1, 10, 1, 10);

    expect(document.getText()).contain(`methodDeclaration() {`);

    vscode.commands.executeCommand(toArrowSyntaxCommand.name).then(() => {
      expect(document.getText()).contain(`methodDeclaration = () => {`);
    });
  });

  it('should handle advanced method declaration with modifier', async () => {
    const { editor, document } = await createEditorForContent(
      `class Test {
        private complexMethodWithParamsAndArgs<T>(t: T) {
          return t;
        }
      }`
    );
    editor.selection = new vscode.Selection(1, 20, 1, 20);

    expect(document.getText()).contain(
      `private complexMethodWithParamsAndArgs<T>(t: T) {`
    );

    vscode.commands.executeCommand(toArrowSyntaxCommand.name).then(() => {
      expect(document.getText()).contain(
        `private complexMethodWithParamsAndArgs = <T>(t: T) => {`
      );
    });
  });
});
