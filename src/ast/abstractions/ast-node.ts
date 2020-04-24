import ts from 'typescript';

export interface ASTNode<T extends ts.Node> {
  getNode(): T;
}
