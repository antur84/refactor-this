import { expect, spy, use } from 'chai';
import * as spies from 'chai-spies';
import * as vscode from 'vscode';
import { removeExplicitReturnTypeCommand } from '../../../../commands/remove-explicit-return-type/remove-explicit-return-type.command.js';
import { createEditorForContent } from '../../../utils/content-creator.js';
use(spies.default);

describe('remove-explicit-return-type Test Suite', () => {
    it('should not crash when executing on invalid selection', async () => {
        const { editor } = await createEditorForContent(
            `class Test {
                private test: number;
            }`
        );
        editor.selection = new vscode.Selection(0, 0, 0, 0);

        const showErrorMessageSpy = spy.on(vscode.window, 'showErrorMessage');
        return vscode.commands
            .executeCommand(removeExplicitReturnTypeCommand.name)
            .then(() => {
                expect(
                    showErrorMessageSpy,
                    'vscode showed error message'
                ).not.to.have.been.called();
            });
    });

    it('should be available when selection is method with an explicit return type', async () => {
        const { editor, document } = await createEditorForContent(
            `class Test {
                foo(): Test {};
            }`
        );
        editor.selection = new vscode.Selection(1, 19, 1, 19);

        const actual = removeExplicitReturnTypeCommand.canBePerformed(
            document,
            editor.selection
        );
        expect(actual).to.be.true;
    });

    it('should be available when selection is function with an explicit return type', async () => {
        const { editor, document } = await createEditorForContent(
            `function foo(): void {}`
        );
        editor.selection = new vscode.Selection(0, 10, 0, 10);

        const actual = removeExplicitReturnTypeCommand.canBePerformed(
            document,
            editor.selection
        );
        expect(actual).to.be.true;
    });

    it('should not be available when selection is missing explicit return type', async () => {
        const { editor, document } = await createEditorForContent(
            `class Test {
                foo(){};
            }`
        );
        editor.selection = new vscode.Selection(1, 19, 1, 19);

        const actual = removeExplicitReturnTypeCommand.canBePerformed(
            document,
            editor.selection
        );
        expect(actual).to.be.false;
    });

    it('should remove explicit return type', async () => {
        const { editor, document } = await createEditorForContent(
            `class Test {
                foo(): Test { };
            }`
        );
        editor.selection = new vscode.Selection(1, 19, 1, 19);

        expect(document.getText()).contain(`foo(): Test { }`);

        return vscode.commands
            .executeCommand(removeExplicitReturnTypeCommand.name)
            .then(() => {
                expect(document.getText()).contain(`foo() { }`);
            });
    });
});
