import { FlowNode, NodeCategory, Socket } from '@behave-graph/core';
import { UnionToIntersection } from 'type-fest';
import { IHasSockets } from './Sockets';

export interface INodeDefinition extends IHasSockets {
  typeName: string;
  category: NodeCategory;
  label: string;
}
