import { makeImmediateNodeDefinition } from '../schema/ImmediateNodes';
import { Sockets, SocketValueType } from '../schema/Sockets';

export function makeConstant<TValueType extends SocketValueType>(valueType: TValueType) {
  return makeImmediateNodeDefinition({
    inputSockets: { a: { valueType } } satisfies Sockets,
    outputSockets: { result: { valueType } } satisfies Sockets,
    exec: ({ readInput, writeOutput }) => {
      writeOutput('result', readInput('a'));
    },
  });
}

export function makeEqual<TValueType extends SocketValueType>(valueType: TValueType) {
  return makeImmediateNodeDefinition({
    inputSockets: { a: { valueType }, b: { valueType } } satisfies Sockets,
    outputSockets: { result: { valueType } } satisfies Sockets,
    exec: ({ readInput, writeOutput }) => {
      writeOutput('result', readInput('a') === readInput('b'));
    },
  });
}

type NumberSocketValueTypes = Extract<SocketValueType, 'float' | 'integer'>;

export function makeAdd<TValueType extends NumberSocketValueTypes>(valueType: TValueType) {
  return makeImmediateNodeDefinition({
    inputSockets: { a: { valueType }, b: { valueType } } satisfies Sockets,
    outputSockets: { result: { valueType } } satisfies Sockets,
    exec: ({ readInput, writeOutput }) => {
      writeOutput(
        'result',
        // @ts-ignore
        readInput('a') + readInput('b')
      );
    },
  });
}

export function makeSub<TValueType extends NumberSocketValueTypes>(valueType: TValueType) {
  return makeImmediateNodeDefinition({
    inputSockets: { a: { valueType }, b: { valueType } } satisfies Sockets,
    outputSockets: { result: { valueType } } satisfies Sockets,
    exec: ({ readInput, writeOutput }) => {
      writeOutput(
        'result',
        // @ts-ignore
        readInput('a') - readInput('b')
      );
    },
  });
}

export function makeNegate<TValueType extends NumberSocketValueTypes>(valueType: TValueType) {
  return makeImmediateNodeDefinition({
    inputSockets: { a: { valueType } } satisfies Sockets,
    outputSockets: { result: { valueType } } satisfies Sockets,
    exec: ({ readInput, writeOutput }) => {
      writeOutput('result', -readInput('a'));
    },
  });
}
