import { DefaultAbstractionImplementationMap } from "./AbstractionImplementationMap.js";

export class AbstractionsRegistry<TAbstractionRegistry>{
  private readonly abstractionImplementationMap: TAbstractionRegistry;

  constructor(abstractionImplementationMap: TAbstractionRegistry) {
    this.abstractionImplementationMap = abstractionImplementationMap
  }

  register<K extends keyof TAbstractionRegistry>(abstractionName: K, abstraction: TAbstractionRegistry[K]) {
    if (abstractionName in this.abstractionImplementationMap) {
      throw new Error(`already registered abstraction ${abstractionName.toString()}`);
    }
    this.abstractionImplementationMap[abstractionName] = abstraction;
  }

  get<K extends keyof TAbstractionRegistry>(abstractionName: K) {
    if (typeof this.abstractionImplementationMap[abstractionName] === 'undefined') {
      throw new Error(`no registered abstraction with name ${abstractionName.toString()}`);
    }
    return this.abstractionImplementationMap[abstractionName]!;
  }
}
