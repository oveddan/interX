import { Graph, Socket, Engine, Assert } from '@behave-graph/core';
import { EventNode, NodeDescription } from '@behave-graph/core';
import { IChainGraph } from '../../abstractions';
import { flowSocketName } from './ExternalTrigger';
import { ChainNodeTypes, IChainNode } from './IChainNode';

const smartActionInvokedTypeName = 'chain/value';
export const variableNameSocket = 'variableName';
export const valueSocketName = 'value';

export class ChainValue extends EventNode implements IChainNode {
  chainNodeType = ChainNodeTypes.Value;

  public static Description = (smartContractActions: IChainGraph) =>
    new NodeDescription(
      smartActionInvokedTypeName,
      'Event',
      'On-Chain Value Get',
      (description, graph) => new ChainValue(description, graph, smartContractActions)
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
      [new Socket('flow', flowSocketName), new Socket('integer', valueSocketName)]
    );
  }

  private handleValueUpdated: ((count: bigint) => void) | undefined = undefined;

  init(engine: Engine) {
    Assert.mustBeTrue(this.handleValueUpdated === undefined);

    this.handleValueUpdated = (count: bigint) => {
      this.writeOutput(valueSocketName, count);
      engine.commitToNewFiber(this, flowSocketName);
    };

    const smartContractActions = this.smartContractActions;
    smartContractActions.registerIntVariableValueListener(this.id, this.handleValueUpdated);
  }

  dispose(engine: Engine) {
    Assert.mustBeTrue(this.handleValueUpdated !== undefined);

    if (!this.handleValueUpdated) return;

    this.smartContractActions.unRegisterIntVariableValueListener(this.id, this.handleValueUpdated);
  }
}
