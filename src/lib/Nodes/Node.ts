import { Graph } from '../Graphs/Graph.js';
import { Metadata } from '../Metadata.js';
import { TAbstractionsConstraint } from '../Registry.js';
import { Socket } from '../Sockets/Socket.js';
import { NodeDescription } from './NodeDescription.js';
import { NodeEvalContext } from './NodeEvalContext.js';

function findSocketByName(sockets: Socket[], name: string): Socket | undefined {
  return sockets.find((socket) => socket.name === name);
}

export class Node<TAbstractions extends TAbstractionsConstraint = {}> {
  public id = '';
  public label = '';
  public metadata: Metadata = {};
  public readonly flow: boolean;
  public evaluateOnStartup = false;
  public async = false;
  public interruptibleAsync = false;

  constructor(
    public readonly description: NodeDescription<TAbstractions>,
    public readonly graph: Graph<TAbstractions>,
    public readonly inputSockets: Socket[],
    public readonly outputSockets: Socket[],
    public readonly evalFunc: (context: NodeEvalContext<TAbstractions>) => void
  ) {
    // determine if this is an eval node
    let areAnySocketsFlowType = false;
    this.inputSockets.forEach((socket) => {
      areAnySocketsFlowType ||= socket.valueTypeName === 'flow';
    });
    this.outputSockets.forEach((socket) => {
      areAnySocketsFlowType ||= socket.valueTypeName === 'flow';
    });
    this.flow = areAnySocketsFlowType;
  }

  getInputSocket(socketName: string): Socket {
    const socket = findSocketByName(this.inputSockets, socketName);
    if (socket === undefined) {
      throw new Error(
        `no input sockets with name: ${socketName} on node ${this.description.typeName}`
      );
    }
    return socket;
  }

  getOutputSocket(socketName: string): Socket {
    const socket = findSocketByName(this.outputSockets, socketName);
    if (socket === undefined) {
      throw new Error(
        `no output socket with name: ${socketName} on node ${this.description.typeName}`
      );
    }
    return socket;
  }
}
