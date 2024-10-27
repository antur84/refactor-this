import { expect, spy, use } from 'chai';
import * as spies from 'chai-spies';
import * as vscode from 'vscode';
import { toArrowSyntaxCommand } from '../../../../commands/to-arrow-syntax/to-arrow-syntax.command.js';
import { createEditorForContent } from '../../../utils/content-creator.js';
use(spies.default);

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

        return vscode.commands
            .executeCommand(toArrowSyntaxCommand.name)
            .then(() => {
                expect(document.getText()).contain(
                    `const funcDeclaration = () => {`
                );
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
        editor.selection = new vscode.Selection(1, 17, 1, 17);

        expect(document.getText()).contain(`methodDeclaration() {`);

        return vscode.commands
            .executeCommand(toArrowSyntaxCommand.name)
            .then(() => {
                expect(document.getText()).contain(
                    `methodDeclaration = () => {`
                );
            });
    });

    it('should handle method with explicit return type', async () => {
        const { editor, document } = await createEditorForContent(
            `class Test {
                methodDeclaration(): Test {
                    return null;
                }
            }`
        );
        editor.selection = new vscode.Selection(1, 17, 1, 17);

        expect(document.getText()).contain(`methodDeclaration(): Test {`);

        return vscode.commands
            .executeCommand(toArrowSyntaxCommand.name)
            .then(() => {
                expect(document.getText()).contain(
                    `methodDeclaration = (): Test => {`
                );
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
        editor.selection = new vscode.Selection(1, 27, 1, 27);

        expect(document.getText()).contain(
            `private complexMethodWithParamsAndArgs<T>(t: T) {`
        );

        return vscode.commands
            .executeCommand(toArrowSyntaxCommand.name)
            .then(() => {
                expect(document.getText()).contain(
                    `private complexMethodWithParamsAndArgs = <T>(t: T) => {`
                );
            });
    });

    it('should not crash when executing on invalid selection', async () => {
        const { editor, document } = await createEditorForContent(
            `class Test {
                private test: number;
            }`
        );
        editor.selection = new vscode.Selection(0, 0, 0, 0);

        const showErrorMessageSpy = spy.on(vscode.window, 'showErrorMessage');
        return vscode.commands
            .executeCommand(toArrowSyntaxCommand.name)
            .then(() => {
                expect(
                    showErrorMessageSpy,
                    'vscode showed error message'
                ).not.to.have.been.called();
            });
    });
});
