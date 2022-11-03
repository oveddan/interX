import { TAbstractionsConstraint } from '../Registry.js';
import { NodeDescription } from './NodeDescription.js';

export function getNodeDescriptions<T extends TAbstractionsConstraint>(importWildcard: any) {
  return Object.keys(importWildcard)
    .map((key) => (importWildcard as { [key: string]: any })[key])
    .filter((value) => value instanceof NodeDescription) as NodeDescription<T>[];
}
