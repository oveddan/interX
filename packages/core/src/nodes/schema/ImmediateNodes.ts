import { ReadWriteToNodeParams } from './FlowNodes';
import { Sockets } from './Sockets';

// type PickSocket<TSockets extends Sockets, k extends keyof TSockets> = TSockets[k];

// type PickValueTypes<TSockets extends Sockets, inputOrder extends readonly (keyof TSockets)[]> = {
//   readonly [K in keyof inputOrder]: ValueTypeNameMapping<PickSocket<TSockets, inputOrder[K]>['valueType']>;
// };

// type unaryEvalFunction<
//   TInput extends Sockets,
//   TOutputs extends Sockets,
//   inputOrder extends readonly (keyof TInput)[],
//   outputOrder extends readonly (keyof TOutputs)[]
// > = (...params: PickValueTypes<TInput, inputOrder>) => PickValueTypes<TOutputs, outputOrder>;

export type ImmediateExecFn<TIn extends Sockets, TOut extends Sockets> = (
  params: ReadWriteToNodeParams<TIn, TOut>
) => void;

export interface IImmediateNode<TIn extends Sockets, TOut extends Sockets> {
  inputSockets: TIn;
  outputSockets: TOut;
  exec: ImmediateExecFn<TIn, TOut>;
}

export function makeImmediateNodeDefinition<TIn extends Sockets, TOut extends Sockets>(
  nodeDefinition: IImmediateNode<TIn, TOut>
) {
  return nodeDefinition;
}

export function makeExec<TIn extends Sockets, TOut extends Sockets>(exec: ImmediateExecFn<TIn, TOut>) {
  return exec;
}

// export function makeImmediateInNOutNodeDefinition<
//   TIn extends Sockets,
//   TOut extends Sockets,
//   inputOrder extends (keyof TIn)[],
//   outputOrder extends (keyof TOut)[]
// >({
//   inputValueTypes,
//   outputValueTypes,
//   unaryEvalFunc,
// }: {
//   inputValueTypes: TIn;
//   outputValueTypes: TOut;
//   inputOrder: keyof TIn[];
//   outputOrder: keyof TOut[];
//   unaryEvalFunc: unaryEvalFunction<TIn, TOut, inputOrder, outputOrder>;
// }): IImmediateNode<TIn, TOut> {
//   const exec: ReadWriteToNodeParams<TIn, TOut> = ({ readInput }) => {
//     return;
//   };

//   // = ({ readInput, writeOutput }) => {
//   //   const inputNames = inputValueTypes.map(({ name }) => name) as SocketNames<TIn>;
//   //   const outputNames = outputValueTypes.map(({ name }) => name) as SocketNames<TOut>;

//   //   const inputValues = inputNames.map((x) => readInput(x)) as unknown as SocketValueTypes<TIn>;

//   //   const outputValues = unaryEvalFunc(...inputValues) as unknown as SocketValueTypes<TOut>;

//   //   outputNames.forEach((outputName, i) => {
//   //     // @ts-ignore
//   //     writeOutput(outputName, outputValues[i]);
//   //   });
//   // };

//   const node: IImmediateNode<TIn, TOut> = {
//     inputSockets: inputValueTypes,
//     outputSockets: outputValueTypes,
//     exec,
//   };

//   return node;
// }
