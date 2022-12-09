import { FlowNode, Graph, NodeDescription, Socket } from '@behave-graph/core';

import { IChainGraph } from '../../abstractions';
import { ChainNodeTypes, ChainValueType } from './IChainNode';
import { makeChainNodeSpec } from './socketGeneration';

export const chainCointerSocketSpec = makeChainNodeSpec({
  socketIndecesForType: ({ counter }) => counter,
  nodeTypeName: 'chain/counter',
  nodeType: ChainNodeTypes.Counter,
  inputValueType: ChainValueType.NotAVariable,
  socketNames: {
    inputFlow: 'flow',
    outputFlow: 'flow',
    outputCount: 'count',
  },
  inputSockets: (socketNames) => [new Socket('flow', socketNames.inputFlow)],
  outputSockets: (socketNames) => [
    new Socket('flow', socketNames.outputFlow),
    new Socket('integer', socketNames.outputCount),
  ],
});

export class ChainCounter extends FlowNode {
  public static Description = (smartContractActions: IChainGraph) =>
    new NodeDescription(
      chainCointerSocketSpec.nodeTypeName,
      'Flow',
      'Chain Counter',
      (description, graph) => new ChainCounter(description, graph)
    );

  constructor(description: NodeDescription, graph: Graph) {
    super(description, graph, chainCointerSocketSpec.inputSockets(), chainCointerSocketSpec.outputSockets());
  }

  triggered() {
    // TODO: if fake - do something
  }
}
