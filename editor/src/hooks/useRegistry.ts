import {
  DefaultLogger,
  ILifecycleEventEmitter,
  ILogger,
  ManualLifecycleEventEmitter,
  registerCoreProfile,
  registerLifecycleEventEmitter,
  registerLogger,
  Registry,
} from '@behave-graph/core';
import { useEffect, useState } from 'react';

const useRegisterCoreProfileAndOthers = ({ otherRegisters }: { otherRegisters: ((registry: Registry) => void)[] }) => {
  const [registry, setRegistry] = useState<Registry>();

  const [lifecyleEmitter, setLifecycleEmitter] = useState<ILifecycleEventEmitter>(new ManualLifecycleEventEmitter());
  const [logger] = useState<ILogger>(new DefaultLogger());

  useEffect(() => {
    const registry = new Registry();
    const lifecyleEmitter = new ManualLifecycleEventEmitter();
    registerCoreProfile(registry);
    registerLogger(registry.dependencies, logger);
    registerLifecycleEventEmitter(registry.dependencies, lifecyleEmitter);
    otherRegisters.forEach((register) => register(registry));

    setRegistry(registry);
    setLifecycleEmitter(lifecyleEmitter);
  }, [otherRegisters, logger]);

  return { registry, lifecyleEmitter, logger };
};

export default useRegisterCoreProfileAndOthers;
