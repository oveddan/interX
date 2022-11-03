import { HasIScene } from '../../../Abstractions/AbstractionImplementationMap.js';
import { Graph } from '../../../Graphs/Graph.js';
import { Node } from '../../../Nodes/Node.js';
import { NodeDescription } from '../../../Nodes/NodeDescription.js';
import { Socket } from '../../../Sockets/Socket.js';
import { toCamelCase } from '../../../toCamelCase.js';
import { IScene } from '../Abstractions/IScene.js';

export class GetSceneProperty<T extends HasIScene> extends Node<T> {
  public static GetDescriptions<T extends HasIScene>(...valueTypeNames: string[]) {
    return valueTypeNames.map(
      (valueTypeName) =>
        new NodeDescription<T>(
          `scene/get/${valueTypeName}`,
          'Query',
          `Get Scene ${toCamelCase(valueTypeName)}`,
          (description, graph) =>
            new GetSceneProperty(description, graph, valueTypeName)
        )
    );
  }

  constructor(
    description: NodeDescription<T>,
    graph: Graph<T>,
    valueTypeName: string
  ) {
    super(
      description,
      graph,
      [new Socket('flow', 'flow'), new Socket('string', 'jsonPath')],
      [new Socket('flow', 'flow'), new Socket(valueTypeName, 'value')],
      (context) => {
        const sceneGraph =
          context.abstractions.get('IScene');
        context.writeOutput(
          'value',
          sceneGraph.getProperty(context.readInput('jsonPath'), valueTypeName)
        );
      }
    );
  }
}
