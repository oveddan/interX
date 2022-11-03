import { TAbstractionsConstraint } from '../Registry.js';
import { NodeDescription } from './NodeDescription.js';

export class NodeTypeRegistry<TAbstractions extends TAbstractionsConstraint> {
  private readonly typeNameToNodeDescriptions: {
    [type: string]: NodeDescription<TAbstractions>;
  } = {};

  clear() {
    Object.keys(this.typeNameToNodeDescriptions).forEach((nodeTypeName) => {
      delete this.typeNameToNodeDescriptions[nodeTypeName];
    });
  }
  register(...descriptions: Array<NodeDescription<TAbstractions>>) {
    descriptions.forEach((description) => {
      if (description.typeName in this.typeNameToNodeDescriptions) {
        throw new Error(
          `already registered node type ${description.typeName} (string)`
        );
      }
      this.typeNameToNodeDescriptions[description.typeName] = description;
    });
  }

  contains(typeName: string): boolean {
    return typeName in this.typeNameToNodeDescriptions;
  }
  get(typeName: string): NodeDescription<TAbstractions> {
    if (!(typeName in this.typeNameToNodeDescriptions)) {
      throw new Error(`no registered node with type name ${typeName}`);
    }
    return this.typeNameToNodeDescriptions[typeName];
  }

  getAllNames(): string[] {
    return Object.keys(this.typeNameToNodeDescriptions);
  }

  getAllDescriptions(): NodeDescription<TAbstractions>[] {
    return Object.values(this.typeNameToNodeDescriptions);
  }
}
