import { FlowSocketNames, FlowSockets, IHasSockets, Sockets, ValueSockets, ValueTypeNameMapping } from './Sockets';
/** Node Engine Access Functions */

export type readNodeInputFn<TSockets extends Sockets> = <V extends ValueSockets<TSockets>, J extends keyof V>(
  param: J
) => ValueTypeNameMapping<V[J]['valueType']>;

export type writeNodeOutputFn<TSockets extends Sockets> = <V extends ValueSockets<TSockets>, J extends keyof V>(
  param: J,
  value: ValueTypeNameMapping<V[J]['valueType']>
) => void;

export type commitFn<T extends Sockets> = <J extends keyof FlowSockets<T>>(param: J) => void;

/** Flow Node Definitions */

export type ReadWriteToNodeParams<TInput extends Sockets, TOutput extends Sockets> = {
  /** reads a value from an input node */
  readInput: readNodeInputFn<TInput>;
  /** writes to an output node */
  writeOutput: writeNodeOutputFn<TOutput>;
};

/** Arguments for the triggered function on a flow node */
export type TriggeredParams<TInput extends Sockets, TOutput extends Sockets, TNodeState> = ReadWriteToNodeParams<
  TInput,
  TOutput
> & {
  /** commits a trigger to a flow node */
  commit: commitFn<TOutput>;
  /** The local node's state */
  readonly state: TNodeState;
  /** The name of the flow input socket that was triggered */
  triggeringSocketName: FlowSocketNames<TInput>;
};

export type TriggeredFunction<TInput extends Sockets, TOutput extends Sockets, TNodeState> = (
  params: TriggeredParams<TInput, TOutput, TNodeState>
) => TNodeState;

export interface IFlowNode<TInputSockets extends Sockets, TOutputSockets extends Sockets, TNodeState>
  extends IHasSockets<TInputSockets, TOutputSockets> {
  /** Called when an input flow node is triggered */
  triggered: TriggeredFunction<TInputSockets, TOutputSockets, TNodeState>;
  initialState: () => TNodeState;
}
export function makeFlowNodeDefinition<
  TInputSockets extends Sockets,
  TOutputSockets extends Sockets,
  TNodeState = void
>(flowNode: IFlowNode<TInputSockets, TOutputSockets, TNodeState>) {
  return flowNode;
}
