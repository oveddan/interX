import { CustomEvent } from '../Events/CustomEvent.js';
import { generateUuid } from '../generateUuid.js';
import { Metadata } from '../Metadata.js';
import { Node } from '../Nodes/Node.js';
import { NodeDescription } from '../Nodes/NodeDescription.js';
import { NodeTypeRegistry } from '../Nodes/NodeTypeRegistry.js';
import { getCustomEventDescription, OnCustomEvent } from '../Profiles/Core/CustomEvents/OnCustomEvent.js';
import { getTriggerCustomEventDescription, TriggerCustomEvent } from '../Profiles/Core/CustomEvents/TriggerCustomEvent.js';
import { getVariableDescription } from '../Profiles/Core/Variables/VariableGet.js';
import { TAbstractionsConstraint } from '../Registry.js';
import { Variable } from '../Variables/Variable.js';
// Purpose:
//  - stores the node graph

export type Nodes<TAbstractions extends TAbstractionsConstraint> = { [id: string]: Node<TAbstractions> };

export type CustomEvents = { [id: string]: CustomEvent };

export type Variables = { [id: string]: Variable }

export class Graph<TAbstractions extends TAbstractionsConstraint = {}> {
  public name = '';
  // TODO: think about whether I can replace this with an immutable strategy?  Rather than having this mutable?
  public readonly nodes: Nodes<TAbstractions> = {};
  // TODO: think about whether I can replace this with an immutable strategy?  Rather than having this mutable?
  public metadata: Metadata = {};
  public readonly dynamicNodeRegistry = new NodeTypeRegistry<TAbstractions>();
  public version = 0;

  constructor(public readonly variables: Variables,
    public readonly customEvents: CustomEvents = {},
    public readonly nodesRegistry: NodeTypeRegistry<TAbstractions>
    ) {}

  updateDynamicNodeDescriptions() {
    // delete existing nodes
    this.dynamicNodeRegistry.clear();
    // re-add variable nodes
    Object.keys(this.variables).forEach((variableId) => {
      this.dynamicNodeRegistry.register(
        getVariableDescription<TAbstractions>(this, variableId),
        getVariableDescription<TAbstractions>(this, variableId));
    });
    // re-add custom event nodes
    Object.keys(this.customEvents).forEach((customEventId) => {
      this.dynamicNodeRegistry.register(
        getCustomEventDescription(this, customEventId),
        getTriggerCustomEventDescription(this, customEventId)
      );
    });
  }
  createNode(nodeTypeName: string, nodeId: string = generateUuid()): Node<TAbstractions> {
    if (nodeId in this.nodes) {
      throw new Error(
        `can not create new node of type ${nodeTypeName} with id ${nodeId} as one with that id already exists.`
      );
    }
    let nodeDescription: NodeDescription<TAbstractions>|undefined = undefined;
    if (this.nodesRegistry.contains(nodeTypeName)) {
      nodeDescription = this.nodesRegistry.get(nodeTypeName);
    }
    if (this.dynamicNodeRegistry.contains(nodeTypeName)) {
      nodeDescription = this.dynamicNodeRegistry.get(nodeTypeName);
    }
    if (nodeDescription === undefined) {
      throw new Error(
        `no registered node descriptions with the typeName ${nodeTypeName}`
      );
    }
    const node = nodeDescription.factory(nodeDescription, this);
    node.id = nodeId;
    this.nodes[nodeId] = node;
    return node;
  }
}
