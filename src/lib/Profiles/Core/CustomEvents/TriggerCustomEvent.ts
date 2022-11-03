import { CustomEvent } from '../../../Events/CustomEvent.js';
import { Graph } from '../../../Graphs/Graph.js';
import { Node } from '../../../Nodes/Node.js';
import { NodeDescription } from '../../../Nodes/NodeDescription.js';
import { NodeEvalContext } from '../../../Nodes/NodeEvalContext.js';
import { TAbstractionsConstraint } from '../../../Registry.js';
import { Socket } from '../../../Sockets/Socket.js';

export class TriggerCustomEvent<T extends TAbstractionsConstraint> extends Node<T> {
    constructor(
    description: NodeDescription<T>,
    graph: Graph<T>,
    public readonly customEvent: CustomEvent
  ) {
    super(
      description,
      graph,
      [
        new Socket('flow', 'flow'),
        ...customEvent.parameters.map(
          (parameter) =>
            new Socket(
              parameter.valueTypeName,
              parameter.name,
              parameter.value,
              parameter.label
            )
        )
      ],
      [new Socket('flow', 'flow')],
      (context: NodeEvalContext<T>) => {
        const parameters: { [parameterName: string]: any } = {};
        customEvent.parameters.forEach((parameterSocket) => {
          parameters[parameterSocket.name] = context.readInput(
            parameterSocket.name
          );
        });
        customEvent.eventEmitter.emit(parameters);
      }
    );
  }
}

export function getTriggerCustomEventDescription<T extends TAbstractionsConstraint>(graph: Graph<T>, customEventId: string) {
    const customEvent = graph.customEvents[customEventId];
    return new NodeDescription<T>(
      `customEvent/trigger/${customEvent.id}`,
      'Action',
      `Trigger ${customEvent.name}`,
      (description, graph) =>
        new TriggerCustomEvent<T>(description, graph, customEvent)
    );
  }

