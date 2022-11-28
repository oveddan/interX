import {
  IHasSockets,
  InputFlowSocketNames,
  InputValueSockets,
  InputValueType,
  OutputFlowSockets,
  OutputValueSockets,
  OutputValueType,
} from './Sockets';
/** Node Engine Access Functions */

export type readNodeInputFn<THasSockets extends IHasSockets> = <J extends keyof InputValueSockets<THasSockets>>(
  param: J
) => InputValueType<THasSockets, J>;

export type writeNodeOutputFn<THasSockets extends IHasSockets> = <J extends keyof OutputValueSockets<THasSockets>>(
  param: J,
  value: OutputValueType<THasSockets, J>
) => void;

export type commitFn<T extends IHasSockets> = <J extends keyof OutputFlowSockets<T>>(param: J) => void;

/** Flow Node Definitions */

export type ReadWriteToNodeParams<T extends IHasSockets> = {
  /** writes to an output node */
  writeOutput: writeNodeOutputFn<T>;
  /** reads a value from an input node */
  readInput: readNodeInputFn<T>;
};

/** Arguments for the triggered function on a flow node */
export type TriggeredParams<T extends IHasSockets, TNodeState> = ReadWriteToNodeParams<T> & {
  /** commits a trigger to a flow node */
  commit: commitFn<T>;
  /** The local node's state */
  readonly state: TNodeState;
  /** The name of the flow input socket that was triggered */
  triggeringSocketName: InputFlowSocketNames<T>;
};

export type TriggeredFunction<T extends IHasSockets, TNodeState> = (
  params: TriggeredParams<T, TNodeState>
) => TNodeState;

export interface IFlowNode<TSockets extends IHasSockets, TNodeState> {
  socketsDefinition: TSockets;
  /** Called when an input flow node is triggered */
  triggered: TriggeredFunction<TSockets, TNodeState>;
  initialState: () => TNodeState;
}
export function makeFlowNodeDefinition<TSockets extends IHasSockets, TNodeState = void>(
  flowNode: IFlowNode<TSockets, TNodeState>
): IFlowNode<TSockets, TNodeState> {
  return flowNode;
}
