import * as path from 'path';
import * as vscode from 'vscode';
import { toArrowSyntaxCommand } from '../../../../commands/to-arrow-syntax/to-arrow-syntax.command';
import { sleep } from '../../../utils/sleep';
describe('to-arrow-syntax Test Suite', () => {
  it('should convert function declarations', async () => {
    const { editor } = await loadEditor();
    editor.selection = new vscode.Selection(15, 20, 15, 21);
    vscode.commands.executeCommand(toArrowSyntaxCommand.name);
    return sleep(60000);
  });
});

const loadEditor = async () => {
  const uri = vscode.Uri.file(
    path
      .join(__dirname + '/../to-arrow-syntax/to-arrow-syntax-example.ts')
      .replace(/\\out\\/, '\\src\\')
  );
  const document = await vscode.workspace.openTextDocument(uri);
  const editor = await vscode.window.showTextDocument(document);
  return { document, editor };
};
