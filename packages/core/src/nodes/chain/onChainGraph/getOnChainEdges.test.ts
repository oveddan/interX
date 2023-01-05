import { FlowsJSON, NodeJSON, SocketNames, SocketsDefinition } from '@oveddan-behave-graph/core';
import { expect } from 'chai';
import { IChainGraph } from 'packages/core/src/abstractions';
import { EdgeDefinitionStruct as EdgeDefinition } from 'typechain-types/contracts/BehaviorGraphToken';
import { OnChainCounter } from '../OnChainCounter';
import { OnChainVariableSet } from '../OnChainVariableSet';
import { SocketIndecesByNodeType } from '../IChainNode';
import { makeToOnChainNodeConverterters } from '../profile';
import { getOnChainEdges } from './getOnChainEdges';
import {
  NodeParameterJSON,
  NodeParameterLinkJSON,
  NodeParametersJSON,
} from 'packages/core/.yalc/@oveddan-behave-graph/core/dist/behave-graph-core.cjs';

const makeFlowsNodeJson = <TOut extends SocketsDefinition, TIn extends SocketsDefinition>({
  flows,
  to: { nodeId },
}: {
  from: TOut;
  to: {
    nodeId: string;
    sockets: TIn;
  };
  flows: {
    from: SocketNames<TOut>;
    to: SocketNames<TIn>;
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

const makeInputLinkParams = <TIn extends SocketsDefinition, TOut extends SocketsDefinition>({
  flows,
  to: { nodeId: toNodeId },
}: {
  from: TIn;
  to: {
    nodeId: string;
    sockets: TOut;
  };
  flows: {
    to: SocketNames<TOut>;
    from: SocketNames<TIn>;
  }[];
}): NodeParametersJSON =>
  flows.reduce((acc: NodeParametersJSON, { from: key, to: toSocketId }) => {
    const paramJson: NodeParameterLinkJSON = {
      link: {
        socket: toSocketId,
        nodeId: toNodeId,
      },
    };
    return {
      ...acc,
      [key]: paramJson,
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

const x: IChainGraph | undefined = undefined;

// @ts-ignore
const chainNodeSpecs = makeToOnChainNodeConverterters(x);

describe('getOnChainEdges', () => {
  it('should return an empty array if there are no edges', () => {
    const chainNodeJson: NodeJSON = {
      id: '0',
      type: OnChainCounter.typeName,
    };

    const edges = getOnChainEdges({
      node: chainNodeJson,
      nodes: [chainNodeJson],
      toOnChainNodeDefinitions: chainNodeSpecs,
      socketIndeces,
    });

    expect(edges).to.have.lengthOf(0);
  });

  it('should return an edge with node and edge ids corresponding to node ids and edge indeces based on the spec', () => {
    const countNodeId = 'countNodeId';

    const variableSetNodeId = 'variableSetNodeId';

    // this is poorly readable - maybe we can make a better function?
    const chainNodeJson: NodeJSON = {
      id: countNodeId,
      type: OnChainCounter.typeName,
      flows: makeFlowsNodeJson({
        from: OnChainCounter.out,
        to: {
          nodeId: variableSetNodeId,
          sockets: OnChainVariableSet.in,
        },
        flows: [
          {
            from: 'flow',
            to: 'flow',
          },
        ],
      }),
    };

    // this is poorly readable - maybe we can make a better function?
    const variableSetNodeJson: NodeJSON = {
      id: variableSetNodeId,
      type: OnChainVariableSet.typeName,
      parameters: makeInputLinkParams({
        from: OnChainVariableSet.in,
        to: {
          nodeId: countNodeId,
          sockets: OnChainCounter.out,
        },
        flows: [
          {
            from: 'value',
            to: 'count',
          },
        ],
      }),
    };

    const allNodes = [chainNodeJson, variableSetNodeJson];

    const common = {
      nodes: allNodes,
      toOnChainNodeDefinitions: chainNodeSpecs,
      socketIndeces,
    };

    const chainNodeEdges = getOnChainEdges({
      node: chainNodeJson,
      ...common,
    });

    const variableSetNodeEdges = getOnChainEdges({
      node: variableSetNodeJson,
      ...common,
    });

    const edges = [...chainNodeEdges, ...variableSetNodeEdges];

    expect(edges).to.have.lengthOf(2);

    const expectedFirstEdge: EdgeDefinition = {
      fromNode: countNodeId,
      fromSocket: socketIndeces.counter.outputFlow,
      toNode: variableSetNodeId,
      toSocket: socketIndeces.variableSet.inputFlow,
    };

    const expetedSecondEdge: EdgeDefinition = {
      fromNode: countNodeId,
      fromSocket: socketIndeces.counter.outputCount,
      toNode: variableSetNodeId,
      toSocket: socketIndeces.variableSet.inputVal,
    };

    expect(edges).to.deep.equal([expectedFirstEdge, expetedSecondEdge]);
  });
});
