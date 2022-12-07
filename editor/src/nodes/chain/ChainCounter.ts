import { FlowNode, Graph, NodeDescription, Socket } from '@behave-graph/core';
import { Fiber } from '@behave-graph/core/src/Execution/Fiber';

import { IChainGraph } from '../../abstractions';
import { ChainNodeTypes, IChainNode } from './IChainNode';

export class ChainCounter extends FlowNode implements IChainNode {
  chainNodeType = ChainNodeTypes.Counter;

  public static Description = (smartContractActions: IChainGraph) =>
    new NodeDescription(
      'flow/counter',
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

  // @ts-ignore
  triggered(fiber: Fiber, triggeringSocketName: string) {
    // TODO: if fake - do something
  }
}
