import { makeImmediateInNOutNode, SocketValueType } from '../schema/INodeDefinition';

export function makeConstant<TValueType extends SocketValueType>(valueType: TValueType) {
  return makeImmediateInNOutNode({
    inputValueTypes: [{ name: 'a', valueType }],
    outputValueType: { name: 'result', valueType: valueType },
    unaryEvalFunc: (a) => a,
  });
}

export function makeEqual<TValueType extends SocketValueType>(valueType: TValueType) {
  return makeImmediateInNOutNode({
    inputValueTypes: [
      { name: 'a', valueType },
      { name: 'b', valueType },
    ] as const,
    outputValueType: { name: 'result', valueType: 'boolean' },
    unaryEvalFunc: (a, b) => a === b,
  });
}

type NumberSocketValueTypes = Extract<SocketValueType, 'float' | 'integer'>;

export function makeAdd<TValueType extends NumberSocketValueTypes>(valueType: TValueType) {
  return makeImmediateInNOutNode({
    inputValueTypes: [
      { name: 'a', valueType },
      { name: 'b', valueType },
    ] as const,
    outputValueType: { name: 'result', valueType },
    unaryEvalFunc: (a, b) =>
      // @ts-ignore
      a + b,
  });
}

export function makeSub<TValueType extends NumberSocketValueTypes>(valueType: TValueType) {
  const inputTypes = [
    { name: 'a', valueType },
    { name: 'b', valueType },
  ] as const;
  return makeImmediateInNOutNode({
    inputValueTypes: inputTypes,
    outputValueType: { name: 'result', valueType },
    unaryEvalFunc: (a, b) =>
      // @ts-ignore
      a - b,
  });
}

export function makeNegate<TValueType extends NumberSocketValueTypes>(valueType: TValueType) {
  return makeImmediateInNOutNode({
    inputValueTypes: [{ name: 'a', valueType }] as const,
    outputValueType: { name: 'result', valueType },
    unaryEvalFunc: (a) =>
      // @ts-ignore
      -a,
  });
}
