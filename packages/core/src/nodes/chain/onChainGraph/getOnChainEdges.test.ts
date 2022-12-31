import { FlowsJSON, NodeJSON, SocketNames, SocketsDefinition } from '@oveddan-behave-graph/core';
import { expect } from 'chai';
import { IChainGraph } from 'packages/core/src/abstractions';
import { EdgeDefinitionStruct } from 'typechain-types/contracts/BehaviorGraphToken';
import { ChainCounter } from '../ChainCounter';
import { ChainVariableSet } from '../ChainVariableSet';
import { SocketIndecesByNodeType } from '../IChainNode';
import { makeChainNodeSpecs } from '../profile';
import { getOnChainEdges } from './getOnChainEdges';

type VariableSetSocketIns = SocketNames<typeof ChainVariableSet.in>;

const makeFlowsNodeJson = <TOutSockets extends SocketsDefinition, TInSockets extends SocketsDefinition>({
  flows,
  to: { nodeId },
}: {
  from: TOutSockets;
  to: {
    nodeId: string;
    sockets: TInSockets;
  };
  flows: {
    from: SocketNames<typeof ChainCounter.out>;
    to: SocketNames<TInSockets>;
  }[];
}): FlowsJSON =>
  flows.reduce((acc, { from: key, to: socket }) => {
    return {
      ...acc,
      [key]: {
        socket,
        nodeId,
      },
    };
  }, {});

const socketIndeces: SocketIndecesByNodeType = {
  counter: {
    inputFlow: 0,
    outputFlow: 1,
    outputCount: 2,
  },
  add: {
    input1: 0,
    input2: 1,
    result: 2,
  },
  variableSet: {
    inputFlow: 0,
    inputVal: 1,
    variableName: 2,
  },
  externalInvoke: {
    outputFlowSocket: 1,
  },
  gate: {
    inputFlow: 0,
    outputGateFalse: 1,
    outputGateTrue: 2,
  },
};

describe('getOnChainEdges', () => {
  it('should return an empty array if there are no edges', () => {
    // const node: NodeJSON = {
    //   id: 'a',
    //   type: 'counter',
    //   flows: {},
    // };
    // const spec: IChainNodeSpecForNode = {
    //   nodeType: 'counter',
    //   inputValueType: 'number',
    //   outputValueType: 'number',
    //   getConfig: () => ({
    //     initialValue: 0,
    //   }),
    //   getInitialValues: () => ({
    //     output: 0,
    //   }),
    // };
    // const nodes: NodeJSON[] = [node];
    // const chainNodeSpecs: Record<string, IChainNodeSpecForNode> = {
    //   counter: spec,
    // };
    // const result = getOnChainEdges(node, spec, nodes, chainNodeSpecs);
    // expect(result).toEqual([]);
  });

  it('should return an edge with node and edge ids corresponding to node ids and edge indeces based on the spec', () => {
    const countNodeId = 'b';

    const variableSetNodeId = 'c';

    const chainNodeJson: NodeJSON = {
      id: countNodeId,
      type: ChainCounter.typeName,
      flows: makeFlowsNodeJson({
        from: ChainCounter.out,
        to: {
          nodeId: variableSetNodeId,
          sockets: ChainVariableSet.in,
        },
        flows: [
          {
            from: 'flow',
            to: 'flow',
          },
          {
            from: 'count',
            to: 'value',
          },
        ],
      }),
    };

    const variableSetNodeJson: NodeJSON = {
      id: variableSetNodeId,
      type: ChainVariableSet.typeName,
    };

    const x: IChainGraph | undefined = undefined;

    // @ts-ignore
    const chainNodeSpecs = makeChainNodeSpecs(x);

    const edges = getOnChainEdges(chainNodeJson, [chainNodeJson, variableSetNodeJson], chainNodeSpecs, socketIndeces);

    expect(edges).to.have.lengthOf(2);

    const expectedFirstEdge: EdgeDefinitionStruct = {
      fromNode: countNodeId,
      fromSocket: socketIndeces.counter.outputFlow,
      toNode: variableSetNodeId,
      toSocket: socketIndeces.variableSet.inputFlow,
    };

    const expetedSecondEdge: EdgeDefinitionStruct = {
      fromNode: countNodeId,
      fromSocket: socketIndeces.counter.outputCount,
      toNode: variableSetNodeId,
      toSocket: socketIndeces.variableSet.inputVal,
    };

    expect(edges).to.deep.equal([expectedFirstEdge, expetedSecondEdge]);
  });
});
