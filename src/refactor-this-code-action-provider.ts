import {
  CancellationToken,
  CodeAction,
  CodeActionContext,
  CodeActionProvider,
  Command,
  ProviderResult,
  Range,
  Selection,
  TextDocument
} from 'vscode';
import { RefactorCommand } from './commands/to-arrow-syntax/abstractions/refactor.command';

export class RefactorThisCodeActionProvider implements CodeActionProvider {
  constructor(private refactorCommands: RefactorCommand[] = []) {}

  provideCodeActions(
    document: TextDocument,
    range: Range | Selection,
    context: CodeActionContext,
    token: CancellationToken
  ): ProviderResult<(Command | CodeAction)[]> {
    var result = new Promise<CodeAction[]>((resolve, reject) => {
      token.onCancellationRequested(() => reject());
      var selection = new Selection(range.start, range.end);
      var validCommands = this.refactorCommands
        .filter(command => !context.only || context.only.contains(command.kind))
        .filter(command => command.canBePerformed(document, selection))
        .map(command => {
          var action = new CodeAction(command.title, command.kind);
          action.command = {
            command: command.name,
            title: command.title,
            tooltip: command.tooltip
          };
          return action;
        });

      resolve(validCommands);
    });
    return result;
  }
}
