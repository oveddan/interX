import { useCallback, useMemo, useRef } from 'react';
import { IChainGraph } from '../abstractions';

type hn = { [id: string]: (count: bigint) => void };

export const makeEmptySmartContractActions = (): IChainGraph => ({
  invoke: () => {},
  registerIntVariableValueListener: () => {},
  unRegisterIntVariableValueListener: () => {},
});

export const useMockSmartContractActions = () => {
  const actionExecutedHandlers = useRef<hn>({});

  const mockCounts = useRef<{ [id: string]: number }>({});

  const registerIntVariableValueListener = useCallback((id: string, cb: (count: bigint) => void) => {
    actionExecutedHandlers.current[id] = cb;
  }, []);

  const unRegisterIntVariableValueListener = useCallback((id: string, cb: (count: bigint) => void) => {
    delete actionExecutedHandlers.current[id];
  }, []);

  const invoke = useCallback(async (actionId: string) => {
    const newCount = (mockCounts.current[actionId] || 0) + 1;
    mockCounts.current[actionId] = newCount;

    const handler = actionExecutedHandlers.current[actionId];
    if (handler) {
      handler(BigInt(newCount));
    }
  }, []);

  const trigger = useCallback(() => {}, []);

  const smartContractAction = useMemo(() => {
    const result: IChainGraph = {
      invoke: trigger,
      registerIntVariableValueListener,
      unRegisterIntVariableValueListener,
    };

    return result;
  }, [invoke, registerIntVariableValueListener, unRegisterIntVariableValueListener]);

  return smartContractAction;
};
