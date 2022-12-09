import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import '@nomicfoundation/hardhat-chai-matchers';
import { expect } from 'chai';
import '@nomiclabs/hardhat-ethers';
import { BehaviorGraph__factory } from '../typechain-types';
import { ethers } from 'hardhat';
import {
  NodeDefinitionStruct,
  EdgeDefinitionStruct,
  NodeDefinitionAndValuesStruct,
  InitialValuesStruct,
} from '../typechain-types/contracts/BehaviorGraph';

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

describe('BehaviorGraph', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, anotherAccount] = await ethers.getSigners();

    const BehaviorGraph = (await ethers.getContractFactory('BehaviorGraph')) as BehaviorGraph__factory;
    const behaviorGraph = await BehaviorGraph.deploy();

    const socketIndeces = await behaviorGraph.getSocketIndecesByNodeType();

    return { behaviorGraph, owner, otherAccount, anotherAccount, socketIndeces };
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
      const variableName = 'counterOutput';
      const nodeDefinitions: { [key: string]: NodeDefinitionAndValuesStruct } = {
        externalTrigger: {
          definition: {
            id: externalTriggerNodeId,
            defined: true,
            nodeType: NodeType.ExternalTrigger,
            inputValueType: VariableType.NotAVariable,
          },
          initialValues: emptyInitialValues(),
        },
        counter: {
          definition: {
            id: counterNodeId,
            defined: true,
            nodeType: NodeType.Counter,
            inputValueType: VariableType.NotAVariable,
          },
          initialValues: emptyInitialValues(),
        },
        variable: {
          definition: {
            id: variableNodeId,
            defined: true,
            nodeType: NodeType.VariableSet,
            inputValueType: VariableType.Int,
          },
          initialValues: {
            ...emptyInitialValues(),
            strings: [
              {
                socket: 2, // socketIndeces.variableSet.variableName,
                value: variableName,
              },
            ],
          },
        },
      };

      it('should raise an error if the counter is triggered directly', async () => {
        const { behaviorGraph, socketIndeces } = await loadFixture(deployFixture);

        const nodes = [nodeDefinitions.counter, nodeDefinitions.variable];

        const edges: EdgeDefinitionStruct[] = [
          // edge from output value of counter to the variable
          connectEdge({
            a: { id: counterNodeId },
            b: { id: variableNodeId },
            fromSocket: socketIndeces.counter.outputCount.valueOf(),
            toSocket: socketIndeces.variableSet.inputVal.valueOf(),
          }),
        ];

        const ipfsHash = 'asdfasdfasfda';
        const tx = await behaviorGraph.safeMint(ipfsHash, nodes, edges);

        await tx.wait();

        const tokenId = 0;

        await expect(behaviorGraph.trigger(tokenId, counterNodeId)).to.be.rejected;
      });

      it('should not trigger an action when there is no flow connection to a variable', async () => {
        const { behaviorGraph, socketIndeces } = await loadFixture(deployFixture);

        const nodes = [nodeDefinitions.externalTrigger, nodeDefinitions.counter, nodeDefinitions.variable];

        const edges: EdgeDefinitionStruct[] = [
          // edge from external trigger to counter
          connectEdge({
            a: nodeDefinitions.externalTrigger.definition,
            b: nodeDefinitions.counter.definition,
            fromSocket: socketIndeces.externalTrigger.outputFlowSocket,
            toSocket: socketIndeces.counter.inputFlow,
          }),
          // edge from output value of counter to the variable
          connectEdge({
            a: nodeDefinitions.counter.definition,
            b: nodeDefinitions.variable.definition,
            fromSocket: socketIndeces.counter.outputCount,
            toSocket: socketIndeces.variableSet.inputVal,
          }),
        ];

        const ipfsHash = 'asdfasdfasfda';
        const tx = await behaviorGraph.safeMint(ipfsHash, nodes, edges);

        await tx.wait();

        const tokenId = 0;

        await expect(behaviorGraph.trigger(tokenId, externalTriggerNodeId)).to.not.emit(
          behaviorGraph,
          'IntVariableUpdated'
        );

        await expect(behaviorGraph.trigger(tokenId, externalTriggerNodeId)).to.not.emit(
          behaviorGraph,
          'IntVariableUpdated'
        );
      });

      it('should emit that a variable is updated when a flow is connected to the variable input', async () => {
        const { behaviorGraph, owner, socketIndeces } = await loadFixture(deployFixture);

        const nodes = [nodeDefinitions.externalTrigger, nodeDefinitions.counter, nodeDefinitions.variable];

        const edges: EdgeDefinitionStruct[] = [
          // edge from external trigger to counter
          connectEdge({
            a: nodeDefinitions.externalTrigger.definition,
            b: nodeDefinitions.counter.definition,
            fromSocket: socketIndeces.externalTrigger.outputFlowSocket,
            toSocket: socketIndeces.counter.inputFlow,
          }),
          // edge from output value of counter to the variable
          connectEdge({
            a: nodeDefinitions.counter.definition,
            b: nodeDefinitions.variable.definition,
            fromSocket: socketIndeces.counter.outputCount,
            toSocket: socketIndeces.variableSet.inputVal,
          }),
          // edge from flow of counter to flow of variable
          connectEdge({
            a: nodeDefinitions.counter.definition,
            b: nodeDefinitions.variable.definition,
            fromSocket: socketIndeces.counter.outputFlow,
            toSocket: socketIndeces.variableSet.inputFlow,
          }),
        ];

        const ipfsHash = 'asdfasdfasfda';
        const tx = await behaviorGraph.safeMint(ipfsHash, nodes, edges);

        await tx.wait();

        const tokenId = 0;

        await expect(behaviorGraph.trigger(tokenId, externalTriggerNodeId))
          .to.emit(behaviorGraph, 'IntVariableUpdated')
          .withArgs(await owner.getAddress(), tokenId, variableName, 1);

        await expect(behaviorGraph.trigger(tokenId, externalTriggerNodeId)).to.emit(
          behaviorGraph,
          'IntVariableUpdated'
        );
        // .withArgs(await owner.getAddress(), tokenId, variableName, 2);
      });
    });
  });
});
