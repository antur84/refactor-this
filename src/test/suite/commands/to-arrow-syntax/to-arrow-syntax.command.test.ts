import * as path from 'path';
import * as vscode from 'vscode';
import { toArrowSyntaxCommand } from '../../../../commands/to-arrow-syntax/to-arrow-syntax.command';
import { sleep } from '../../../utils/sleep';
suite('Func to Arrow Test Suite', () => {
  test('Can read test file', async () => {
    const uri = vscode.Uri.file(
      path
        .join(__dirname + '/../to-arrow-syntax/to-arrow-syntax-example.ts')
        .replace(/\\out\\/, '\\src\\')
    );
    const document = await vscode.workspace.openTextDocument(uri);
    const editor = await vscode.window.showTextDocument(document);
    editor.selection = new vscode.Selection(1, 2, 1, 12);
    vscode.commands.executeCommand(toArrowSyntaxCommand.name);

    return sleep(60000);
  });
});
