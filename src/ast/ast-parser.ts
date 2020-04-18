import { createSourceFile, ScriptTarget } from 'typescript';
import { TextDocument } from 'vscode';
import { NodeLocatorFunc } from './locators/abstractions/node-locator';

export class ASTParser {
  constructor(private document: TextDocument) {}
  private getSourceFile() {
    var sourceFile = createSourceFile(
      this.document.fileName,
      this.document.getText(),
      ScriptTarget.Latest
    );
    return sourceFile;
  }

  getNode(nodeLocator: NodeLocatorFunc) {
    var sourceFile = this.getSourceFile();
    return nodeLocator(sourceFile);
  }
}
