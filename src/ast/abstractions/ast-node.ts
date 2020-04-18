import { Node, SourceFile } from 'typescript';

export interface ASTNode {
  sourceFile: SourceFile;
  getNode(): Node;
}
