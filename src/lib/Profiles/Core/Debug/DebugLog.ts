import { DefaultAbstractionImplementationMap, HasILogger } from '../../../Abstractions/AbstractionImplementationMap.js';
import { Graph } from '../../../Graphs/Graph.js';
import { Node } from '../../../Nodes/Node.js';
import { NodeDescription } from '../../../Nodes/NodeDescription.js';
import { NodeEvalContext } from '../../../Nodes/NodeEvalContext.js';
import { Socket } from '../../../Sockets/Socket.js';

export class Log extends Node<HasILogger> {
  public static Description = new NodeDescription(
    'debug/log',
    'Action',
    'Debug Log',
    (description, graph) => new Log(description, graph)
  );

  constructor(description: NodeDescription, graph: Graph<DefaultAbstractionImplementationMap>) {
    super(
      description,
      graph,
      [new Socket('flow', 'flow'), new Socket('string', 'text')],
      [new Socket('flow', 'flow')],
      (context) => {
        const logger =
          context.abstractions.get('ILogger');
        logger.info(context.readInput('text'));
      }
    );
  }
}
