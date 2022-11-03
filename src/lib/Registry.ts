import { DefaultAbstractionImplementationMap } from './Abstractions/AbstractionImplementationMap.js';
import { AbstractionsRegistry } from './Abstractions/AbstractionsRegistry.js';
import { NodeTypeRegistry } from './Nodes/NodeTypeRegistry.js';
import { ValueTypeRegistry } from './Values/ValueTypeRegistry.js';

export class Registry {
  public readonly values = new ValueTypeRegistry();
  public readonly nodes = new NodeTypeRegistry();
}
