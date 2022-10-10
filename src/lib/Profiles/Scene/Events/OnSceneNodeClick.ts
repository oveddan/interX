import { Node } from '../../../Nodes/Node.js';
import { NodeEvalContext } from '../../../Nodes/NodeEvalContext.js';
import { Socket } from '../../../Sockets/Socket.js';

// very 3D specific.
export class OnSceneNodeClick extends Node {
  constructor() {
    super(
      'Event',
      'event/nodeClick',
      [],
      [new Socket('flow', 'flow'), new Socket('float', 'nodeIndex')],
      (context: NodeEvalContext) => {
        context.writeOutput('nodeIndex', -1); // TODO: Replace with real value.
      }
    );
  }
}
