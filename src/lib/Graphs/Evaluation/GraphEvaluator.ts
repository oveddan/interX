/* eslint-disable space-in-parens */

import { AbstractionsRegistry } from '../../Abstractions/AbstractionsRegistry.js';
import { EventEmitter } from '../../Events/EventEmitter.js';
import { Link } from '../../Nodes/Link.js';
import { Node } from '../../Nodes/Node.js';
import { Registry, TAbstractionsConstraint } from '../../Registry.js';
import { sleep } from '../../sleep.js';
import {  Graph, Nodes } from '../Graph.js';
import { NodeEvaluationEvent } from './NodeEvaluationEvent.js';
import { SyncExecutionBlock } from './SyncExecutionBlock.js';

export class GraphEvaluator<TAbstractions extends TAbstractionsConstraint> {
  // tracking the next node+input socket to execute.
  private readonly executionBlockQueue: SyncExecutionBlock<TAbstractions>[] = [];
  public readonly asyncNodes: Node<TAbstractions>[] = [];
  public readonly interruptibleAsyncNodes: Node<TAbstractions>[] = [];
  public readonly onNodeEvaluation = new EventEmitter<NodeEvaluationEvent<TAbstractions>>();

  constructor(public readonly graph: Graph<TAbstractions>, public readonly registry: Registry<TAbstractions>) {
    const nodes = this.graph.nodes;
    Object.values(nodes).forEach((node) => {
      if (node.evaluateOnStartup) {
        this.executionBlockQueue.push(
          new SyncExecutionBlock<TAbstractions>(this.registry, nodes, this, new Link(node.id, ''))
        );
      }
    });
  }

  // asyncCommit
  asyncCommit(
    outputFlowSocket: Link,
    syncEvaluationCompletedListener: (() => void) | undefined
  ) {
    const node = this.graph.nodes[outputFlowSocket.nodeId];
    const outputSocket = node.getOutputSocket(outputFlowSocket.socketName);

    if (outputSocket.links.length > 1) {
      throw new Error(
        'invalid for an output flow socket to have multiple downstream links:' +
          `${node.description.typeName}.${outputSocket.name} has ${outputSocket.links.length} downlinks`
      );
    }
    if (outputSocket.links.length === 1) {
      const syncExecutionBlock = new SyncExecutionBlock<TAbstractions>(this.registry, this.graph.nodes, this, new Link(node.id, ''), syncEvaluationCompletedListener);
      this.executionBlockQueue.push(syncExecutionBlock);
    }
  }

  // NOTE: This does not execute all if there are promises.
  executeAllSync(limitInSeconds = 100, limitInSteps = 100000000): number {
    const startDateTime = Date.now();
    let elapsedSeconds = 0;
    let elapsedSteps = 0;
    while (
      elapsedSteps < limitInSteps &&
      elapsedSeconds < limitInSeconds &&
      this.executionBlockQueue.length > 0
    ) {
      const currentExecutionBlock = this.executionBlockQueue[0];
      if (!currentExecutionBlock.executeStep()) {
        // remove first element
        this.executionBlockQueue.shift();
      }
      elapsedSeconds = (Date.now() - startDateTime) * 0.001;
      elapsedSteps++;
    }
    return elapsedSteps;
  }

  async executeAllAsync(
    limitInSeconds = 100,
    limitInSteps = 100000000
  ): Promise<number> {
    const startDateTime = Date.now();
    let elapsedSteps = 0;
    let elapsedTime = 0;
    let iterations = 0;
    do {
      if (iterations > 0) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(0);
      }
      elapsedSteps += this.executeAllSync(
        limitInSeconds - elapsedTime,
        limitInSteps - elapsedSteps
      );
      elapsedTime = (Date.now() - startDateTime) * 0.001;
      iterations += 1;
    } while (
      (this.asyncNodes.length > 0 || this.executionBlockQueue.length > 0) &&
      elapsedTime < limitInSeconds &&
      elapsedSteps < limitInSteps
    );

    return elapsedSteps;
  }
}
