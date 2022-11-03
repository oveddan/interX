import { ILifecycleEventEmitter } from "../Profiles/Core/Abstractions/ILifecycleEventEmitter";
import { ILogger } from "../Profiles/Core/Abstractions/ILogger";
import { IScene } from "../Profiles/Scene/Abstractions/IScene";

export interface DefaultAbstractionImplementationMap {
  'ILogger'?: ILogger,
  'IScene'?: IScene,
  'ILifecycleEventEmitter'?: ILifecycleEventEmitter
}


export type HasILogger = Pick<DefaultAbstractionImplementationMap, "ILogger">;
export type HasIScene = Pick<DefaultAbstractionImplementationMap, "IScene">;