import { ILifecycleEventEmitter } from "../Profiles/Core/Abstractions/ILifecycleEventEmitter";
import { ILogger } from "../Profiles/Core/Abstractions/ILogger";
import { IScene } from "../Profiles/Scene/Abstractions/IScene";

export interface AbstractionImplementationMap {
  [key: string]: object | undefined
}

export interface DefaultAbstractionImplementationMap extends AbstractionImplementationMap {
  'ILogger'?: ILogger,
  'IScene'?: IScene,
  'ILifecycleEventEmitter'?: ILifecycleEventEmitter
}
