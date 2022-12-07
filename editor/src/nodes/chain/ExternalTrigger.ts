import { FlowNode, NodeDescription, Socket, Graph, Engine, Assert } from '@behave-graph/core';
import { IChainGraph } from '../../abstractions';
import { ChainNodeDefinition, ChainNodeSpec, ChainNodeTypes, ChainValueType, IChainNode } from './IChainNode';

const actionName = 'chain/externalTrigger';
export const flowSocketName = 'flow';

export class ExternalTrigger extends FlowNode implements IChainNode {
  public static Description = (smartContractActions: IChainGraph) =>
    new NodeDescription(
      actionName,
      'Flow',
      'Invoke Smart Contract Action',
      (description, graph) => new ExternalTrigger(description, graph, smartContractActions)
    );

  toNodeDefinition = (): ChainNodeSpec => ({
    nodeType: ChainNodeTypes.ExternalTrigger,
    inputValueType: ChainValueType.NotAVariable,
  });

  constructor(description: NodeDescription, graph: Graph, private smartContractActions: IChainGraph) {
    super(description, graph, [new Socket('flow', flowSocketName)], [new Socket('flow', flowSocketName)]);
  }

  triggered() {
    this.smartContractActions.trigger(this.id, flowSocketName);
  }
}
