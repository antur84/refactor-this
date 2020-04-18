import { createSourceFile, Node, ScriptTarget, SourceFile } from 'typescript';
import { TextDocument } from 'vscode';

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

  getNode(nodeFinder: (sourceFile: SourceFile) => Node) {
    var sourceFile = this.getSourceFile();
    return nodeFinder(sourceFile);
  }
}