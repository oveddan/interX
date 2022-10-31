import { AbstractionImplementationMap, DefaultAbstractionImplementationMap } from "./AbstractionImplementationMap";

export class AbstractionsRegistry<T extends AbstractionImplementationMap = DefaultAbstractionImplementationMap>{
  private readonly abstractionImplementationMap: T;

  constructor(abstractionImplementationMap: T) {
    this.abstractionImplementationMap = abstractionImplementationMap
  }

  register<K extends keyof T>(abstractionName: K, abstraction: T[K]) {
    if (abstractionName in this.abstractionImplementationMap) {
      throw new Error(`already registered abstraction ${abstractionName.toString()}`);
    }
    this.abstractionImplementationMap[abstractionName] = abstraction;
  }

  get<K extends keyof T>(abstractionName: K) {
    if (typeof this.abstractionImplementationMap[abstractionName] === 'undefined') {
      throw new Error(`no registered abstraction with name ${abstractionName.toString()}`);
    }
    return this.abstractionImplementationMap[abstractionName]!;
  }
}
