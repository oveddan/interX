import { Graph } from '../Graphs/Graph.js';
import { TAbstractionsConstraint } from '../Registry.js';
import { Node } from './Node.js';
import { NodeCategory } from './NodeCategory.js';

export type NodeFactory<TAbstractions extends TAbstractionsConstraint> = (entry: NodeDescription<TAbstractions>, graph: Graph<TAbstractions>) => Node<TAbstractions>;

export class NodeDescription<TAbstractions extends TAbstractionsConstraint = {}> {
  constructor(
    public readonly typeName: string,
    public readonly category: NodeCategory,
    public readonly label: string,
    public readonly factory: NodeFactory<TAbstractions>
  ) {}
}
