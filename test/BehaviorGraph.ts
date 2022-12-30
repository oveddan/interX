import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import '@nomicfoundation/hardhat-chai-matchers';
import { expect } from 'chai';
import '@nomiclabs/hardhat-ethers';
import { BehaviorGraphToken__factory, BehaviorGraph__factory } from '../typechain-types';
import { ethers } from 'hardhat';
import {
  NodeDefinitionStruct,
  EdgeDefinitionStruct,
  NodeDefinitionAndValuesStruct,
  InitialValuesStruct,
  SocketIndecesByNodeTypeStruct,
  NodeConfigStruct,
} from '../typechain-types/contracts/BehaviorGraph';
import { PromiseOrValue } from '../typechain-types/common';

enum VariableType {
  Int = 0,
  Bool = 1,
  NotAVariable = 2,
}

enum NodeType {
  ExternalTrigger = 0,
  Counter = 1,
  Add = 2,
  Gate = 3,
  VariableSet = 4,
}

function connectEdge({
  a,
  b,
  fromSocket,
  toSocket,
}: {
  a: Pick<NodeDefinitionStruct, 'id'>;
  b: Pick<NodeDefinitionStruct, 'id'>;
  fromSocket: number;
  toSocket: number;
}) {
  const result: EdgeDefinitionStruct = {
    fromNode: a.id,
    toNode: b.id,
    fromSocket,
    toSocket,
  };

  return result;
}

const emptyInitialValues = (): InitialValuesStruct => ({
  booleans: [],
  integers: [],
  strings: [],
});

const VARIABLE_NAME_SOCKET = 6;

const socketIndeces: SocketIndecesByNodeTypeStruct = {
  add: {
    input1: 0,
    input2: 1,
    result: 2,
  },
  counter: {
    inputFlow: 0,
    outputCount: 1,
    outputFlow: 2,
  },
  gate: {
    inputFlow: 0,
    outputGateFalse: 1,
    outputGateTrue: 2,
  },
  variableSet: {
    inputFlow: 0,
    inputVal: 1,
  },
  externalInvoke: {
    outputFlowSocket: 0,
  },
};

const emptyConfig: NodeConfigStruct = {
  invocationId: 0,
  invocationNameDefined: false,
  variableId: 0,
  variableIdDefined: false,
};

describe('BehaviorGraph', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, anotherAccount] = await ethers.getSigners();

    const BehaviorGraph = (await ethers.getContractFactory('BehaviorGraphToken')) as BehaviorGraphToken__factory;
    const behaviorGraph = await BehaviorGraph.deploy(socketIndeces);

    // const socketIndeces = await behaviorGraph.getSocketIndecesByNodeType();

    return { behaviorGraph, owner, otherAccount, anotherAccount };
  }

  describe('safeMint', () => {
    it('does not raise an erroor if the caller is not the owner', async () => {
      const { behaviorGraph, otherAccount } = await loadFixture(deployFixture);

      const ipfsHash = 'asdfasdfasfda';

      const nodesToCreate: NodeDefinitionAndValuesStruct[] = [];
      const edgesToCreate: EdgeDefinitionStruct[] = [];

      await expect(behaviorGraph.connect(otherAccount).safeMint(ipfsHash, nodesToCreate, edgesToCreate)).to.not.be
        .rejected;
    });
  });
  describe('trigger', () => {
    describe('basic counter', () => {
      const externalTriggerNodeId = 'external';
      const counterNodeId = 'a';
      const variableNodeId = 'b';
      const variableId = 1;
      const invocationId = 1;
      const nodeDefinitions: { [key: string]: NodeDefinitionAndValuesStruct } = {
        externalTrigger: {
          definition: {
            id: externalTriggerNodeId,
            defined: true,
            nodeType: NodeType.ExternalTrigger,
            inputValueType: VariableType.NotAVariable,
          },
          initialValues: emptyInitialValues(),
          config: {
            ...emptyConfig,
            invocationNameDefined: true,
            invocationId,
          },
        },
        counter: {
          definition: {
            id: counterNodeId,
            defined: true,
            nodeType: NodeType.Counter,
            inputValueType: VariableType.NotAVariable,
          },
          initialValues: emptyInitialValues(),
          config: emptyConfig,
        },
        variable: {
          definition: {
            id: variableNodeId,
            defined: true,
            nodeType: NodeType.VariableSet,
            inputValueType: VariableType.Int,
          },
          initialValues: emptyInitialValues(),
          config: {
            ...emptyConfig,
            variableIdDefined: true,
            variableId,
          },
        },
      };

      it('should raise an error if the counter is triggered directly', async () => {
        const { behaviorGraph } = await loadFixture(deployFixture);

        const nodes = [nodeDefinitions.counter, nodeDefinitions.variable];

        const edges: EdgeDefinitionStruct[] = [
          // edge from output value of counter to the variable
          connectEdge({
            a: { id: counterNodeId },
            b: { id: variableNodeId },
            fromSocket: socketIndeces.counter.outputCount as number,
            toSocket: socketIndeces.variableSet.inputVal as number,
          }),
        ];

        const ipfsHash = 'asdfasdfasfda';
        const tx = await behaviorGraph.safeMint(ipfsHash, nodes, edges);

        await tx.wait();

        const tokenId = 0;

        await expect(behaviorGraph.invoke(tokenId, invocationId)).to.be.rejected;
      });

      it('should not trigger an action when there is no flow connection to a variable', async () => {
        const { behaviorGraph } = await loadFixture(deployFixture);

        const nodes = [nodeDefinitions.externalTrigger, nodeDefinitions.counter, nodeDefinitions.variable];

        const edges: EdgeDefinitionStruct[] = [
          // edge from external trigger to counter
          connectEdge({
            a: nodeDefinitions.externalTrigger.definition,
            b: nodeDefinitions.counter.definition,
            fromSocket: socketIndeces.externalInvoke.outputFlowSocket as number,
            toSocket: socketIndeces.counter.inputFlow as number,
          }),
          // edge from output value of counter to the variable
          connectEdge({
            a: nodeDefinitions.counter.definition,
            b: nodeDefinitions.variable.definition,
            fromSocket: socketIndeces.counter.outputCount as number,
            toSocket: socketIndeces.variableSet.inputVal as number,
          }),
        ];

        const ipfsHash = 'asdfasdfasfda';
        const tx = await behaviorGraph.safeMint(ipfsHash, nodes, edges);

        await tx.wait();

        const tokenId = 0;

        await expect(behaviorGraph.invoke(tokenId, invocationId)).to.not.emit(behaviorGraph, 'IntVariableUpdated');

        await expect(behaviorGraph.invoke(tokenId, invocationId)).to.not.emit(behaviorGraph, 'IntVariableUpdated');
      });

      it('should emit that a variable is updated when a flow is connected to the variable input', async () => {
        const { behaviorGraph, owner } = await loadFixture(deployFixture);

        const nodes = [nodeDefinitions.externalTrigger, nodeDefinitions.counter, nodeDefinitions.variable];

        const edges: EdgeDefinitionStruct[] = [
          // edge from external trigger to counter
          connectEdge({
            a: nodeDefinitions.externalTrigger.definition,
            b: nodeDefinitions.counter.definition,
            fromSocket: socketIndeces.externalInvoke.outputFlowSocket as number,
            toSocket: socketIndeces.counter.inputFlow as number,
          }),
          // edge from output value of counter to the variable
          connectEdge({
            a: nodeDefinitions.counter.definition,
            b: nodeDefinitions.variable.definition,
            fromSocket: socketIndeces.counter.outputCount as number,
            toSocket: socketIndeces.variableSet.inputVal as number,
          }),
          // edge from flow of counter to flow of variable
          connectEdge({
            a: nodeDefinitions.counter.definition,
            b: nodeDefinitions.variable.definition,
            fromSocket: socketIndeces.counter.outputFlow as number,
            toSocket: socketIndeces.variableSet.inputFlow as number,
          }),
        ];

        const ipfsHash = 'asdfasdfasfda';
        const tx = await behaviorGraph.safeMint(ipfsHash, nodes, edges);

        await tx.wait();

        const tokenId = 0;

        await expect(behaviorGraph.invoke(tokenId, invocationId))
          .to.emit(behaviorGraph, 'IntVariableUpdated')
          .withArgs(await owner.getAddress(), tokenId, variableId, 1);

        await expect(behaviorGraph.invoke(tokenId, invocationId)).to.emit(behaviorGraph, 'IntVariableUpdated');
      });
    });
  });
});
