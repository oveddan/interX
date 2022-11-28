import {
  IHasSockets,
  Known,
  makeSocketsFromSpec,
  SocketNames,
  Sockets,
  SocketsFromSpec,
  SocketSpec,
  SocketValueTypes,
  ValueTypeNameMapping,
} from './Sockets';

export type unaryEvalFunction<TInput extends readonly SocketSpec[], TOutputs extends readonly SocketSpec[]> = (
  ...params: SocketValueTypes<TInput>
) => SocketValueTypes<TOutputs>;

export type immediateReadIn<TSockets extends readonly SocketSpec[]> = <
  S extends Known<SocketsFromSpec<TSockets>>,
  K extends keyof S
>(
  key: K
) => S[K];

export type immediateWriteOut<TSockets extends readonly SocketSpec[]> = <
  S extends Known<SocketsFromSpec<TSockets>>,
  K extends keyof S
>(
  key: K,
  value: S[K]
) => void;

type ImmediateExecParams<TIn extends readonly SocketSpec[], TOut extends readonly SocketSpec[]> = {
  readInput: immediateReadIn<TIn>;
  writeOutput: immediateWriteOut<TOut>;
};

type ImmediateExecFn<TIn extends readonly SocketSpec[], TOut extends readonly SocketSpec[]> = (
  params: ImmediateExecParams<TIn, TOut>
) => void;

export interface IImmediateNode<TIn extends readonly SocketSpec[], TOut extends readonly SocketSpec[]> {
  inputSockets: TIn;
  outputSockets: TOut;
  exec: ImmediateExecFn<TIn, TOut>;
}

export function makeImmediateInNOutNodeDefinition<
  TIn extends readonly SocketSpec[],
  TOut extends readonly SocketSpec[]
>({
  inputValueTypes,
  outputValueTypes,
  unaryEvalFunc,
}: {
  inputValueTypes: TIn;
  outputValueTypes: TOut;
  unaryEvalFunc: unaryEvalFunction<TIn, TOut>;
}): IImmediateNode<TIn, TOut> {
  const exec: ImmediateExecFn<TIn, TOut> = ({ readInput, writeOutput }) => {
    const inputNames = inputValueTypes.map(({ name }) => name) as SocketNames<TIn>;
    const outputNames = outputValueTypes.map(({ name }) => name) as SocketNames<TOut>;

    const inputValues = inputNames.map((x) => readInput(x)) as unknown as SocketValueTypes<TIn>;

    const outputValues = unaryEvalFunc(...inputValues) as unknown as SocketValueTypes<TOut>;

    outputNames.forEach((outputName, i) => {
      // @ts-ignore
      writeOutput(outputName, outputValues[i]);
    });
  };

  const node: IImmediateNode<TIn, TOut> = {
    inputSockets: inputValueTypes,
    outputSockets: outputValueTypes,
    exec,
  };

  return node;
}
