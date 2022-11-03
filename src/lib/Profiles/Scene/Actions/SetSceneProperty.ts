import { HasIScene } from '../../../Abstractions/AbstractionImplementationMap.js';
import { Graph } from '../../../Graphs/Graph.js';
import { Node } from '../../../Nodes/Node.js';
import { NodeDescription } from '../../../Nodes/NodeDescription.js';
import { Socket } from '../../../Sockets/Socket.js';
import { toCamelCase } from '../../../toCamelCase.js';

export class SetSceneProperty extends Node<HasIScene> {
  public static GetDescriptions(...valueTypeNames: string[]) {
    return valueTypeNames.map(
      (valueTypeName) =>
        new NodeDescription(
          `scene/set/${valueTypeName}`,
          'Action',
          `Set Scene ${toCamelCase(valueTypeName)}`,
          (description, graph) =>
            new SetSceneProperty(description, graph, valueTypeName)
        )
    );
  }

  constructor(
    description: NodeDescription,
    graph: Graph,
    valueTypeName: string
  ) {
    super(
      description,
      graph,
      [
        new Socket('flow', 'flow'),
        new Socket('string', 'jsonPath'),
        new Socket(valueTypeName, 'value')
      ],
      [new Socket('flow', 'flow')],
      (context) => {
        const scene = context.abstractions.get('IScene');
        const value = context.readInput('value');
        scene.setProperty(context.readInput('jsonPath'), valueTypeName, value);
      }
    );
  }
}
