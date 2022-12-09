import { FlowNode, NodeDescription, Socket, Graph, Engine, Assert } from '@behave-graph/core';
import { IChainGraph } from '../../abstractions';
import {
  ChainNodeDefinition,
  ChainNodeSpec,
  ChainNodeTypes,
  ChainValueType,
  SocketIndecesByNodeType,
} from './IChainNode';
import { getSocketIndex, makeChainNodeSpec } from './socketGeneration';

export const externalTriggerSocketSpec = makeChainNodeSpec({
  socketIndecesForType: ({ externalTrigger }) => externalTrigger,
  nodeTypeName: 'chain/externalTrigger',
  nodeType: ChainNodeTypes.ExternalTrigger,
  inputValueType: ChainValueType.NotAVariable,
  socketNames: {
    outputFlowSocket: 'flow',
  },
  inputSockets: (socketNames) => [new Socket('flow', socketNames.outputFlowSocket)],
  outputSockets: (socketNames) => [new Socket('flow', socketNames.outputFlowSocket)],
});

export class ExternalTrigger extends FlowNode {
  public static Description = (smartContractActions: IChainGraph) =>
    new NodeDescription(
      externalTriggerSocketSpec.nodeTypeName,
      'Flow',
      'Invoke Smart Contract Action',
      (description, graph) => new ExternalTrigger(description, graph, smartContractActions)
    );

  constructor(description: NodeDescription, graph: Graph, private smartContractActions: IChainGraph) {
    super(description, graph, externalTriggerSocketSpec.inputSockets(), externalTriggerSocketSpec.outputSockets());
  }

  triggered() {
    this.smartContractActions.trigger(this.id, externalTriggerSocketSpec.inputSockets()[0].name);
  }
}
