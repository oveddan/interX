import { IRegistry } from '@behave-graph/core';
import { useEffect } from 'react';

export const useRegisterDependency = (
  dependencies: IRegistry['dependencies'] | undefined,
  dependency: any,
  register: (registry: IRegistry['dependencies'], dependency: any) => void
) => {
  useEffect(() => {
    if (dependencies) register(dependencies, dependency);
  }, [dependencies, dependency]);
};
