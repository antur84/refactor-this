import { Node } from 'typescript';

export interface ASTNode<T extends Node> {
  getNode(): T;
}
