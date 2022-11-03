import { CustomEvent } from '../../../Events/CustomEvent.js';
import { Graph } from '../../../Graphs/Graph.js';
import { Node } from '../../../Nodes/Node.js';
import { NodeDescription } from '../../../Nodes/NodeDescription.js';
import { NodeEvalContext } from '../../../Nodes/NodeEvalContext.js';
import { TAbstractionsConstraint } from '../../../Registry.js';
import { Socket } from '../../../Sockets/Socket.js';

export class OnCustomEvent<T extends TAbstractionsConstraint> extends Node<T> {


  constructor(
    description: NodeDescription<T>,
    graph: Graph<T>,
    public readonly customEvent: CustomEvent
  ) {
    super(
      description,
      graph,
      [],
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
      (context: NodeEvalContext<T>) => {
        customEvent.eventEmitter.addListener((parameters) => {
          customEvent.parameters.forEach((parameterSocket) => {
            if (!(parameterSocket.name in parameters)) {
              throw new Error(
                `parameters of custom event do not align with parameters of custom event node, missing ${parameterSocket.name}`
              );
            }
            context.writeOutput(
              parameterSocket.name,
              parameters[parameterSocket.name]
            );
          });
          context.commit('flow');
        });
      }
    );

    // TODO replace with analysis of category, if Event, then evaluate on startup, it is async and interruptable.
    this.evaluateOnStartup = true;
    this.async = true;
    this.interruptibleAsync = true;
  }
}

export function getCustomEventDescription<T extends TAbstractionsConstraint>(graph: Graph<T>, customEventId: string) {
    const customEvent = graph.customEvents[customEventId];
    return new NodeDescription<T>(
      `customEvent/onTriggered/${customEvent.id}`,
      'Event',
      `On ${customEvent.name}`,
      (description, graph) => new OnCustomEvent(description, graph, customEvent)
    );
  }
