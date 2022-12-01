import { makeImmediateNodeDefinition } from '../schema/ImmediateNodes';
import { Sockets, SocketSpec } from '../schema/Sockets';
import { makeConstant, makeEqual } from './Shared';

const singleBoolean = {
  a: {
    valueType: 'boolean',
  },
} satisfies Sockets;
const doubleBoolean = {
  ...singleBoolean,
  b: {
    valueType: 'boolean',
  },
} satisfies Sockets;

const singleOutput = {
  result: {
    valueType: 'boolean',
  },
} satisfies Sockets;

export const Constant = makeConstant('boolean');

export const And = makeImmediateNodeDefinition({
  inputSockets: doubleBoolean,
  outputSockets: singleOutput,
  exec: ({ readInput, writeOutput }) => {
    writeOutput('result', readInput('a') && readInput('b'));
  },
});

export const Or = makeImmediateNodeDefinition({
  inputSockets: doubleBoolean,
  outputSockets: singleOutput,
  exec: ({ readInput, writeOutput }) => {
    writeOutput('result', readInput('a') || readInput('b'));
  },
});

export const Not = makeImmediateNodeDefinition({
  inputSockets: singleBoolean,
  outputSockets: singleOutput,
  exec: ({ readInput, writeOutput }) => {
    writeOutput('result', !readInput('a'));
  },
});

export const ToFloat = makeImmediateNodeDefinition({
  inputSockets: singleBoolean,
  outputSockets: {
    result: {
      valueType: 'float',
    },
  },
  exec: ({ readInput, writeOutput }) => {
    writeOutput('result', readInput('a') ? 1 : 0);
  },
});

export const Equal = makeEqual('boolean');
