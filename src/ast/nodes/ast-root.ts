import { createSourceFile, Node, ScriptTarget, SourceFile } from 'typescript';
import { TextDocument } from 'vscode';
import { ASTNode } from '../abstractions/ast-node';

export class ASTRoot implements ASTNode<Node> {
  constructor(private document: TextDocument) {}

  private _sourceFile: SourceFile;

  get sourceFile() {
    if (!this._sourceFile) {
      this._sourceFile = this.getSourceFile();
    }
    return this._sourceFile;
  }

  private getSourceFile() {
    var sourceFile = createSourceFile(
      this.document.fileName,
      this.document.getText(),
      ScriptTarget.Latest
    );
    return sourceFile;
  }

  getNode(): Node {
    return this.sourceFile;
  }
}
