import { Graph, Socket, Engine, Assert, FlowNode } from '@behave-graph/core';
import { NodeDescription } from '@behave-graph/core';
import { IChainGraph } from '../../abstractions';
import { ChainNodeTypes, ChainValueType } from './IChainNode';
import { makeChainNodeSpec } from './socketGeneration';

export const chainVariableSetSocketSpec = makeChainNodeSpec({
  socketIndecesForType: ({ variableSet }) => variableSet,
  socketTypeName: 'chain/intVariableSet',
  nodeType: ChainNodeTypes.VariableSet,
  inputValueType: ChainValueType.Int,
  socketNames: {
    inputFlow: 'flow',
    inputVal: 'value',
    variableName: 'variableName',
  },
  inputSockets: (socketNames) => [
    new Socket('string', socketNames.variableName),
    new Socket('flow', socketNames.inputFlow),
    new Socket('integer', socketNames.inputVal),
  ],
  outputSockets: () => [],
});

export class ChainVariableSet extends FlowNode {
  public static Description = (smartContractActions: IChainGraph) =>
    new NodeDescription(
      chainVariableSetSocketSpec.socketTypeName,
      'Flow',
      'Set On Chain Int Value',
      (description, graph) => new ChainVariableSet(description, graph, smartContractActions)
    );

  constructor(description: NodeDescription, graph: Graph, private readonly smartContractActions: IChainGraph) {
    super(description, graph, chainVariableSetSocketSpec.inputSockets(), chainVariableSetSocketSpec.outputSockets());
  }

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
