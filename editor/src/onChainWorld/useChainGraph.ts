import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useContract, useContractEvent, useSigner } from 'wagmi';
import { abi } from '../contracts/abi';
import { BigNumber } from 'ethers';
import { IChainGraph } from '../abstractions';

type hn = { [id: string]: (count: bigint) => void };

const useChainGraph = (contractAddress: string, tokenId: number) => {
  const { data: signer } = useSigner();

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer,
  });

  const [connectedContract, setConnected] = useState<typeof contract | undefined>();

  useEffect(() => {
    if (!contract || !signer) return;
    const result = contract?.connect(signer);

    console.log('contract connected');

    // @ts-ignore
    setConnected(result);
  }, [contract, signer]);

  const actionExecutedHandlers = useRef<hn>({});

  useContractEvent({
    address: contractAddress,
    abi,
    eventName: 'IntValueUpdated',
    listener: (executerAddress, actionTokenId, nodeId, value) => {
      if (tokenId !== actionTokenId.toNumber()) return;

      const handler = actionExecutedHandlers.current[nodeId];
      if (handler) handler(BigInt(value.toNumber()));
    },
  });

  const getIntVariableValue = useCallback(
    async (id: string, connectedContract: typeof contract) => {
      console.log('no connected contract yet');
      if (!connectedContract) return;

      console.log('getting action count');
      const actionCount = await connectedContract.getActionCount(BigNumber.from(tokenId), id);

      console.log('got action count', actionCount.toNumber());

      return actionCount.toNumber();
    },
    [typeof contract]
  );

  useEffect(() => {
    if (!connectedContract) return;

    console.log('got connected contract', actionExecutedHandlers.current);
    Object.entries(actionExecutedHandlers.current).forEach(async ([action, handler]) => {
      const actionCount = await getIntVariableValue(action, connectedContract);

      console.log('connected now executing', actionCount);
      handler(BigInt(actionCount || 0));
    });
  }, [connectedContract, getIntVariableValue]);

  const registerTriggerHandler = useCallback(
    async (id: string, cb: (count: bigint) => void) => {
      actionExecutedHandlers.current[id] = cb;
      if (!connectedContract) return;
      console.log('setting trigger handler', actionExecutedHandlers.current);

      const actionCount = await getIntVariableValue(id, connectedContract);

      if (actionCount) {
        cb(BigInt(actionCount));
      }
    },
    [getIntVariableValue, connectedContract]
  );

  const unRegisterTriggerHandler = useCallback((id: string, cb: (count: bigint) => void) => {
    delete actionExecutedHandlers.current[id];
  }, []);

  const trigger = useCallback(
    async (actionId: string, connectedContract: typeof contract) => {
      if (!connectedContract) return;
      const transaction = await connectedContract.trigger(BigNumber.from(tokenId), actionId);

      await transaction.wait();
    },
    [tokenId]
  );

  const smartContractAction = useMemo(() => {
    if (!connectedContract) return;
    const result: IChainGraph = {
      trigger: (nodeId: string, socketId: string) => {
        if (!connectedContract) return;
        trigger(nodeId, connectedContract);
      },
      registerIntVariableValueListener: registerTriggerHandler,
      unRegisterIntVariableValueListener: unRegisterTriggerHandler,
    };

    return result;
  }, [trigger, registerTriggerHandler, unRegisterTriggerHandler, connectedContract]);

  return smartContractAction;
};

export default useChainGraph;
