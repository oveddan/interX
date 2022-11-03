import { HasIScene } from '../../../Abstractions/AbstractionImplementationMap.js';
import { Graph } from '../../../Graphs/Graph.js';
import { Node } from '../../../Nodes/Node.js';
import { NodeDescription } from '../../../Nodes/NodeDescription.js';
import { NodeEvalContext } from '../../../Nodes/NodeEvalContext.js';
import { Socket } from '../../../Sockets/Socket.js';

// very 3D specific.
export class OnSceneNodeClick<T extends HasIScene> extends Node<T> {
  public static Description = <T extends HasIScene>() => new NodeDescription<T>(
    'scene/nodeClick',
    'Event',
    'On Node Click',
    (description, graph) => new OnSceneNodeClick<T>(description, graph)
  );

  constructor(description: NodeDescription<T>, graph: Graph<T>) {
    super(
      description,
      graph,
      [],
      [new Socket('flow', 'flow'), new Socket('float', 'nodeIndex')],
      (context: NodeEvalContext<T>) => {
        context.writeOutput('nodeIndex', -1); // TODO: Replace with real value.
      }
    );
  }
}

export function getOnSceneNodeClickDescription<T extends HasIScene>() {
  return 
}
