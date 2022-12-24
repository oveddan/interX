import { Registry } from '@behave-graph/core';
import { useCallback } from 'react';
import { IChainGraph, registerChainGraphProfile } from '@blocktopia/core';

const useRegisterChainGraphProfile = (actions: IChainGraph) => {
  const register = useCallback(
    (registry: Registry) => {
      registerChainGraphProfile(registry, actions);
    },
    [actions]
  );

  return register;
};

export default useRegisterChainGraphProfile;
