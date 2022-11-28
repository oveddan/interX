import { makeImmediateInNOutNode, SocketSpec, SocketValueType } from '../schema/INodeDefinition';
import { makeConstant, makeEqual } from './Shared';

const makeOutputNode = <T extends SocketValueType>(t: T) => ({ name: 'result', valueType: t });

const booleans = (['a', 'b', 'c', 'd'] as const).map((name) => ({
  name,
  valueType: 'boolean',
})) satisfies SocketSpec[];

const singleBoolean = [booleans[0]] as const;
const doubleBoolean = [booleans[0], booleans[1]] as const;
const outputBoolean = makeOutputNode('boolean');

export const Constant = makeConstant('boolean');

export const And = makeImmediateInNOutNode({
  inputValueTypes: doubleBoolean,
  outputValueType: outputBoolean,
  unaryEvalFunc: (a, b) => a && b,
});

export const Or = makeImmediateInNOutNode({
  inputValueTypes: doubleBoolean,
  outputValueType: outputBoolean,
  unaryEvalFunc: (a, b) => a || b,
});

export const Not = makeImmediateInNOutNode({
  inputValueTypes: singleBoolean,
  outputValueType: outputBoolean,
  unaryEvalFunc: (a) => !a,
});

export const ToFloat = makeImmediateInNOutNode({
  inputValueTypes: singleBoolean,
  outputValueType: makeOutputNode('float'),
  unaryEvalFunc: (a) => (a ? 1 : 0),
});

export const Equal = makeEqual('boolean');
