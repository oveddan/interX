import { Object3D } from 'three';

import IThree from '../../../Abstractions/IThree';
import Node from '../../../Nodes/Node';
import Socket from '../../../Sockets/Socket';
import FlowSocket from '../../../Sockets/Typed/FlowSocket';
import IdSocket from '../../../Sockets/Typed/IdSocket';

export default class GetSceneNodeProperty<T> extends Node {
  constructor(nodeName: string, public readonly valueTypeName: string, getter: (node: Object3D) => T) {
    super(
      'Query',
      nodeName,
      [
        new FlowSocket(),
        new IdSocket('nodeId'),
      ],
      [new FlowSocket(),
        new Socket('value', valueTypeName)],
      (context) => {
        const three = context.graph.registry.implementations.get<IThree>('IThree');
        const object3D = three.getObject3D(context.readInput('modeId'));
        context.writeOutput('value', getter(object3D));
      },
    );
  }
}