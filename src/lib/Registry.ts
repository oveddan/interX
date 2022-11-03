import { AbstractionsRegistry } from './Abstractions/AbstractionsRegistry.js';
import { NodeTypeRegistry } from './Nodes/NodeTypeRegistry.js';
import { ValueTypeRegistry } from './Values/ValueTypeRegistry.js';

export type TAbstractionsConstraint = {[key: string]: any};

export class Registry<TAbstractions extends TAbstractionsConstraint> {
  public readonly values = new ValueTypeRegistry();
  public readonly nodes = new NodeTypeRegistry<TAbstractions>();
  constructor(public readonly abstractions: AbstractionsRegistry<TAbstractions> ) {}
}
