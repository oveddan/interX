import { Graph, Socket, Engine, Assert, FlowNode } from '@behave-graph/core';
import { EventNode, NodeDescription } from '@behave-graph/core';
import { IChainGraph } from '../../abstractions';
import { flowSocketName } from './ExternalTrigger';
import { ChainNodeSpec, ChainNodeTypes, ChainValueType, IChainNode } from './IChainNode';

const smartActionInvokedTypeName = 'chain/value';
export const variableNameSocket = 'variableName';
export const valueSocketName = 'value';

export class ChainVariableSet extends FlowNode implements IChainNode {
  public static Description = (smartContractActions: IChainGraph) =>
    new NodeDescription(
      smartActionInvokedTypeName,
      'Flow',
      'Set On Chain Int Value',
      (description, graph) => new ChainVariableSet(description, graph, smartContractActions)
    );

  constructor(description: NodeDescription, graph: Graph, private readonly smartContractActions: IChainGraph) {
    super(
      description,
      graph,
      [
        new Socket('string', variableNameSocket),
        new Socket('flow', flowSocketName),
        new Socket('integer', valueSocketName),
      ],
      []
    );
  }

  toNodeDefinition = (): ChainNodeSpec => ({
    nodeType: ChainNodeTypes.VariableSet,
    inputValueType: ChainValueType.Int,
  });

  private handleValueUpdated: ((count: bigint) => void) | undefined = undefined;

  triggered() {
    // TODO: if fake smart contract, trigger somewhere?
  }

  dispose(engine: Engine) {
    Assert.mustBeTrue(this.handleValueUpdated !== undefined);

    if (!this.handleValueUpdated) return;

    this.smartContractActions.unRegisterIntVariableValueListener(this.id, this.handleValueUpdated);
  }
}
