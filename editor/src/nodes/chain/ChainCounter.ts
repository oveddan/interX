import { FlowNode, Graph, NodeDescription, Socket } from '@behave-graph/core';
import { Fiber } from '@behave-graph/core/src/Execution/Fiber';

import { IChainGraph } from '../../abstractions';
import { ChainNodeSpec, ChainNodeTypes, ChainValueType, IChainNode } from './IChainNode';

export class ChainCounter extends FlowNode implements IChainNode {
  public static Description = (smartContractActions: IChainGraph) =>
    new NodeDescription(
      'chain/counter',
      'Flow',
      'Counter',
      (description, graph) => new ChainCounter(description, graph)
    );

  constructor(description: NodeDescription, graph: Graph) {
    super(
      description,
      graph,
      [new Socket('flow', 'flow'), new Socket('flow', 'reset')],
      [new Socket('flow', 'flow'), new Socket('integer', 'count')]
    );
  }

  toNodeDefinition = (): ChainNodeSpec => ({
    nodeType: ChainNodeTypes.Counter,
    inputValueType: ChainValueType.NotAVariable,
  });

  triggered() {
    // TODO: if fake - do something
  }
}
