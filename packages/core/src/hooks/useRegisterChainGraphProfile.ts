import { Registry } from '@behave-graph/core';
import { useCallback } from 'react';
import { IChainGraph } from '../abstractions';
import { registerChainGraphProfile } from '../nodes/chain/profile';

export const useRegisterChainGraphProfile = (actions: IChainGraph) => {
  const register = useCallback(
    (registry: Registry) => {
      registerChainGraphProfile(registry, actions);
    },
    [actions]
  );

  return register;
};
