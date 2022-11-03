import { Graph } from '../../../Graphs/Graph.js';
import { Node } from '../../../Nodes/Node.js';
import { NodeDescription } from '../../../Nodes/NodeDescription.js';
import { TAbstractionsConstraint } from '../../../Registry.js';
import { Socket } from '../../../Sockets/Socket.js';
import { Variable } from '../../../Variables/Variable.js';

export class VariableGet<TAbstractions extends TAbstractionsConstraint> extends Node<TAbstractions>  {
  constructor(
    description: NodeDescription<TAbstractions>,
    graph: Graph<TAbstractions>,
    public readonly variable: Variable
  ) {
    super(
      description,
      graph,
      [],
      [new Socket(variable.valueTypeName, 'value', undefined, variable.name)], // output socket label uses variable name like UE4, but name is value to avoid breaking graph when variable is renamed
      (context) => {
        context.writeOutput('value', variable.get());
      }
    );
  }
}

export function getVariableDescription<TAbstractions extends TAbstractionsConstraint>(graph: Graph<TAbstractions>, variableId: string) {
    const variable = graph.variables[variableId];
    return new NodeDescription<TAbstractions>(
      `variable/get/${variable.id}`,
      'Query',
      '', // these nodes have no name in Unreal Engine Blueprints
      (description, graph) => new VariableGet(description, graph, variable)
    );
  }