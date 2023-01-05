import { ExpectTrue, GraphJSON, NodeJSON } from '@oveddan-behave-graph/core';
import { generateOnChainNodesFromGraph } from '../onChainGraph/extractOnChainNodesFromGraph';
import { SocketIndecesByNodeType } from '../IChainNode';
import { expect } from 'chai';
import { OnChainCounter } from '../OnChainCounter';

// describe('extractOnChainNodesFromGraph', () => {
//   const variableName = 'myVar';
//   const chainVariableSet: NodeJSON = {
//     id: 'c',
//     type: ChainCounter.typeName,
//     parameters: {
//       [chainVariableSetSocketSpec.socketNames.variableName]: {
//         value: variableName,
//       },
//     },
//   };
//   const chainCounter: NodeJSON = {
//     id: '2',
//     type: chainCointerSocketSpec.nodeTypeName,
//     flows: {
//       [chainCointerSocketSpec.socketNames.outputFlow]: {
//         nodeId: chainVariableSet.id,
//         socket: chainVariableSetSocketSpec.socketNames.inputFlow,
//       },
//       [chainCointerSocketSpec.socketNames.outputCount]: {
//         nodeId: chainVariableSet.id,
//         socket: chainVariableSetSocketSpec.socketNames.inputVal,
//       },
//     },
//   };

//   const externalTrigger: NodeJSON = {
//     id: 'a',
//     type: externalTriggerSocketSpec.nodeTypeName,
//     flows: {
//       [externalTriggerSocketSpec.socketNames.outputFlowSocket]: {
//         nodeId: chainCounter.id,
//         socket: chainCointerSocketSpec.socketNames.inputFlow,
//       },
//     },
//   };

//   const graph: GraphJSON = {
//     nodes: [externalTrigger, chainCounter, chainVariableSet],
//   };

//   const socketIndecesByNodeType: SocketIndecesByNodeType = {
//     add: {
//       input1: 0,
//       input2: 1,
//       result: 2,
//     },
//     counter: {
//       inputFlow: 0,
//       outputCount: 1,
//       outputFlow: 2,
//     },
//     externalInvoke: {
//       outputFlowSocket: 1,
//     },
//     gate: {
//       inputFlow: 0,
//       outputGateFalse: 1,
//       outputGateTrue: 2,
//     },
//     variableSet: {
//       inputFlow: 0,
//       inputVal: 1,
//       variableName: 2,
//     },
//   };

//   const result = extractOnChainNodesFromGraph(graph, socketIndecesByNodeType);

//   it('generates on chain nodes for each chain node in graph', () => {
//     expect(result.nodeDefinitions).to.have.lengthOf(3);

//     const externalTriggerNode = result.nodeDefinitions.find((node) => node.definition.id === externalTrigger.id);
//     expect(externalTriggerNode?.definition.defined).to.be.true;
//     expect(externalTriggerNode?.definition.inputValueType).to.equal(externalTriggerSocketSpec.inputValueType);

//     const counterNode = result.nodeDefinitions.find((node) => node.definition.id === chainCounter.id);
//     expect(counterNode?.definition.defined).to.be.true;

//     const variableSetNode = result.nodeDefinitions.find((node) => node.definition.id === chainVariableSet.id);
//     expect(variableSetNode?.definition.defined).to.be.true;
//   });

//   it('sets the on chain-node initial values', () => {
//     const variableSetNode = result.nodeDefinitions.find((node) => node.definition.id === chainVariableSet.id);

//     expect(variableSetNode?.initialValues.strings).to.have.lengthOf(1);
//     expect(variableSetNode?.initialValues.strings[0]).to.eql({
//       value: variableName,
//       socket: socketIndecesByNodeType.variableSet.variableName,
//     });
//   });

//   it.only('generates on-chain edges for each edge between on-chain nodes', () => {
//     const triggerToCounterEdges = result.edgeDefinitions.filter((x) => {
//       return x.fromNode === externalTrigger.id && x.toNode === chainCounter.id;
//     });

//     console.log({ triggerToCounterEdges });

//     expect(triggerToCounterEdges).to.have.lengthOf(1);

//     expect(triggerToCounterEdges[0].fromSocket).to.equal(socketIndecesByNodeType.externalTrigger.outputFlowSocket);
//     expect(triggerToCounterEdges[0].toSocket).to.equal(socketIndecesByNodeType.counter.inputFlow);
//   });

//   it('excludes off-chain nodes', () => {});

//   it('excludes edges between off-chain and on-chain nodes', () => {});
// });
