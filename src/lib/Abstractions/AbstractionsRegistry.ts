import { DefaultAbstractionImplementationMap } from "./AbstractionImplementationMap.js";

export class AbstractionsRegistry<TAbstractions = DefaultAbstractionImplementationMap>{
  private readonly abstractionImplementationMap: TAbstractions;

  constructor(abstractionImplementationMap: TAbstractions) {
    this.abstractionImplementationMap = abstractionImplementationMap
  }

  register<K extends keyof TAbstractions>(abstractionName: K, abstraction: TAbstractions[K]) {
    if (abstractionName in this.abstractionImplementationMap) {
      throw new Error(`already registered abstraction ${abstractionName.toString()}`);
    }
    this.abstractionImplementationMap[abstractionName] = abstraction;
  }

  get<K extends keyof TAbstractions>(abstractionName: K) {
    if (typeof this.abstractionImplementationMap[abstractionName] === 'undefined') {
      throw new Error(`no registered abstraction with name ${abstractionName.toString()}`);
    }
    return this.abstractionImplementationMap[abstractionName]!;
  }
}
