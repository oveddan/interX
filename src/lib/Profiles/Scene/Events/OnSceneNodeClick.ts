import { HasIScene } from '../../../Abstractions/AbstractionImplementationMap.js';
import { Graph } from '../../../Graphs/Graph.js';
import { Node } from '../../../Nodes/Node.js';
import { NodeDescription } from '../../../Nodes/NodeDescription.js';
import { NodeEvalContext } from '../../../Nodes/NodeEvalContext.js';
import { Socket } from '../../../Sockets/Socket.js';

// very 3D specific.
export class OnSceneNodeClick extends Node<HasIScene> {
  public static Description = new NodeDescription<HasIScene>(
    'scene/nodeClick',
    'Event',
    'On Node Click',
    (description, graph) => new OnSceneNodeClick(description, graph)
  );

  constructor(description: NodeDescription, graph: Graph) {
    super(
      description,
      graph,
      [],
      [new Socket('flow', 'flow'), new Socket('float', 'nodeIndex')],
      (context: NodeEvalContext) => {
        context.writeOutput('nodeIndex', -1); // TODO: Replace with real value.
      }
    );
  }
}
