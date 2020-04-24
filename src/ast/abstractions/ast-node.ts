import { Node } from 'typescript';

export interface ASTNode {
  getNode(): Node;
}
