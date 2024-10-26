import * as ts from 'typescript';

export interface ASTNode<T extends ts.Node> {
    getNode(): T | undefined;
}
