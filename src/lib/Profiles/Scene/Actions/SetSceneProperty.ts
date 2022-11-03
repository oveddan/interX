import { HasIScene } from '../../../Abstractions/AbstractionImplementationMap.js';
import { Graph } from '../../../Graphs/Graph.js';
import { Node } from '../../../Nodes/Node.js';
import { NodeDescription } from '../../../Nodes/NodeDescription.js';
import { Socket } from '../../../Sockets/Socket.js';
import { toCamelCase } from '../../../toCamelCase.js';
import { IScene } from '../Abstractions/IScene.js';

export class SetSceneProperty<T extends HasIScene> extends Node<T> {
  public static GetDescriptions<T extends HasIScene>(scene: IScene, ...valueTypeNames: string[]) {
    return valueTypeNames.map(
      (valueTypeName) =>
        new NodeDescription<T>(
          `scene/set/${valueTypeName}`,
          'Action',
          `Set Scene ${toCamelCase(valueTypeName)}`,
          (description, graph) =>
            new SetSceneProperty<T>(description, graph, valueTypeName, scene)
        )
    );
  }

  constructor(
    description: NodeDescription<T>,
    graph: Graph<T>,
    valueTypeName: string,
    private readonly scene: IScene
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
        const scene = this.scene;
        const value = context.readInput('value');
        scene.setProperty(context.readInput('jsonPath'), valueTypeName, value);
      }
    );
  }
}
