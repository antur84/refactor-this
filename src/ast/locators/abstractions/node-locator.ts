import { Node, SourceFile } from 'typescript';

export type NodeLocatorFunc = (sourceFile: SourceFile) => Node;
