import { Node, Socket } from '@oveddan-behave-graph/core';
import { ChainNodeTypes, ChainValueType, SocketIndecesByNodeType } from './IChainNode';

export type SocketIO = {
  getInput: (key: string) => { index: number; valueTypeName: string } | undefined;
  getOutput: (key: string) => { index: number; valueTypeName: string } | undefined;
};

type SocketIndeces = { [key: string]: number };
export type SocketNames<TSocketIndeces extends SocketIndeces> = { [key in keyof TSocketIndeces]: string };

export type ChainSocketSpecGenerator<
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

export function makeChainNodeSpec<
  TSocketIndeces extends SocketIndeces,
  TSocketNames extends SocketNames<TSocketIndeces>
>(chainSocketSpec: ChainSocketSpecGenerator<TSocketIndeces, TSocketNames>) {
  return {
    ...chainSocketSpec,
    inputSockets: () => chainSocketSpec.inputSockets(chainSocketSpec.socketNames),
    outputSockets: () => chainSocketSpec.outputSockets(chainSocketSpec.socketNames),
  };
}

export const getSocketIndex = <TSocketIndeces extends { [key: string]: number }>(
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

export const generateInputOutputSocketMappings = <TSocketIndeces extends { [key: string]: number }>(
  { inputSockets, outputSockets }: Pick<Node, 'inputSockets' | 'outputSockets'>,
  socketNames: SocketNames<TSocketIndeces>,
  indeces: TSocketIndeces
): SocketIO => {
  return {
    getInput: getSocketIndex(inputSockets, socketNames, indeces),
    getOutput: getSocketIndex(outputSockets, socketNames, indeces),
  };
};
