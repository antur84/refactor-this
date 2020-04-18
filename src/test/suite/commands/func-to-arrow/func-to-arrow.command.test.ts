import * as path from 'path';
import * as vscode from 'vscode';
import { funcToArrowCommand } from '../../../../commands/func-to-arrow/func-to-arrow.command';
import { sleep } from '../../../utils/sleep';
suite('Func to Arrow Test Suite', () => {
  test('Can read test file', async () => {
    const uri = vscode.Uri.file(
      path
        .join(__dirname + '/../func-to-arrow/func-to-arrow-example.ts')
        .replace(/\\out\\/, '\\src\\')
    );
    const document = await vscode.workspace.openTextDocument(uri);
    const editor = await vscode.window.showTextDocument(document);
    editor.selection = new vscode.Selection(1, 2, 1, 12);
    vscode.commands.executeCommand(funcToArrowCommand.name);

    return sleep(60000);
  });
});
