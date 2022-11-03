import { validateNodeRegistry } from './Nodes/Validation/validateNodeRegistry.js';
import { Registry, TAbstractionsConstraint } from './Registry.js';
import { validateValueRegistry } from './Values/Validation/validateValueRegistry.js';

export function validateRegistry<T extends TAbstractionsConstraint>(registry: Registry<T>): string[] {
  const errorList: string[] = [];
  errorList.push(
    ...validateValueRegistry(registry),
    ...validateNodeRegistry(registry)
  );
  return errorList;
}
