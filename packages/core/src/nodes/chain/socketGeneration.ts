import { Socket } from '@oveddan-behave-graph/core';
import { ChainNodeTypes, ChainValueType, SocketIndecesByNodeType } from './IChainNode';

export type SocketIO = {
  getInput: (key: string) => { index: number; valueTypeName: string } | undefined;
  getOutput: (key: string) => { index: number; valueTypeName: string } | undefined;
};

type SocketIndeces = { [key: string]: number };
export type SocketNames<TSocketIndeces extends SocketIndeces> = { [key in keyof TSocketIndeces]: string };

type ChainSocketSpecGenerator<
  TSocketIndeces extends SocketIndeces,
  TSocketNames extends SocketNames<TSocketIndeces>
> = {
  socketIndecesForType: (socketIndeces: SocketIndecesByNodeType) => TSocketIndeces;
  nodeTypeName: string;
  nodeType: ChainNodeTypes;
  inputValueType: ChainValueType;
  socketNames: TSocketNames;
  inputSockets: (socketNames: TSocketNames) => Socket[];
  outputSockets: (socketNames: TSocketNames) => Socket[];
};

function makeChainNodeSpec<TSocketIndeces extends SocketIndeces, TSocketNames extends SocketNames<TSocketIndeces>>(
  chainSocketSpec: ChainSocketSpecGenerator<TSocketIndeces, TSocketNames>
) {
  return {
    ...chainSocketSpec,
    inputSockets: () => chainSocketSpec.inputSockets(chainSocketSpec.socketNames),
    outputSockets: () => chainSocketSpec.outputSockets(chainSocketSpec.socketNames),
  };
}

const getSocketIndex = <TSocketIndeces extends { [key: string]: number }>(
  sockets: Socket[],
  socketNames: SocketNames<TSocketIndeces>,
  indeces: TSocketIndeces
) => {
  const socketMapping = sockets.reduce(
    (acc: Record<string, { index: number; valueTypeName: string }>, { name, valueTypeName }) => {
      const socketName = socketNames[name];
      const socketIndex = indeces[name];
      if (!socketIndex) return acc;

      return {
        ...acc,
        [socketName]: {
          index: socketIndex,
          valueTypeName,
        },
      };
    },
    {}
  );

  return (key: string) => socketMapping[key];
};
