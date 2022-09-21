import { promises as fs } from 'fs';

import {
  Debug, GraphEvaluator, readGraphFromJSON, registerGenericNodes,
  Registry, validateDirectedAcyclicGraph, validateGraphRegistry, validateLinks,
} from '../../../dist/lib/index';

async function main() {
  Debug.onVerbose.clear();

  const registry = new Registry();
  registerGenericNodes(registry.nodes);

  const graphJsonPath = process.argv[2];
  if (graphJsonPath === undefined) {
    throw new Error('no path specified');
  }

  Debug.logVerbose(`reading behavior graph: ${graphJsonPath}`);
  const textFile = await fs.readFile(graphJsonPath, { encoding: 'utf-8' });
  const graph = readGraphFromJSON(JSON.parse(textFile), registry);
  graph.name = graphJsonPath;

  // await fs.writeFile('./examples/test.json', JSON.stringify(writeGraphToJSON(graph), null, ' '), { encoding: 'utf-8' });
  Debug.logVerbose('validating:');
  const errorList: string[] = [];
  Debug.logVerbose('validating registry');
  errorList.push(...validateGraphRegistry(registry));
  Debug.logVerbose('validating socket links have matching types on either end');
  errorList.push(...validateLinks(graph));
  Debug.logVerbose('validating that graph is directed acyclic');
  errorList.push(...validateDirectedAcyclicGraph(graph));

  if (errorList.length > 0) {
    Debug.logError(`${errorList.length} errors found:`);
    errorList.forEach((errorText, errorIndex) => {
      Debug.logError(`${errorIndex}: ${errorText}`);
    });
    return;
  }

  Debug.logVerbose('creating behavior graph');
  const graphEvaluator = new GraphEvaluator(graph);

  /*
  graphEvaluator.evaluationListeners.push((node: Node, nodeEvaluationType: NodeEvaluationType, async: boolean) => {
    if (nodeEvaluationType === NodeEvaluationType.None) {
      console.log(`Node ${node.typeName} ${node.id} completed evaluation.`);
    } else {
      console.log(`Node ${node.typeName} ${node.id} started evaluation, mode: ${NodeEvaluationType[nodeEvaluationType]}, async: ${async}.`);
    }
  });
  */

  Debug.logVerbose('triggering start event');
  graphEvaluator.triggerEvents('event/start');

  Debug.logVerbose('executing all (async)');
  await graphEvaluator.executeAllAsync(5.0);
}

main();
