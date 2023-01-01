import { Registry } from '@oveddan-behave-graph/core';
import { useCallback } from 'react';
import { IChainGraph } from '../abstractions';
import { registerChainGraphProfile } from '../nodes';

export const useRegisterChainGraphProfile = (actions: IChainGraph) => {
  const register = useCallback(
    (registry: Registry) => {
      registerChainGraphProfile(registry, actions);
    },
    [actions]
  );

  return register;
};
