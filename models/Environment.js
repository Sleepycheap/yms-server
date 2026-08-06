export class Environment {
  constructor(ID, instanceName, instanceIP) {
    this.ID = ID;
    this.instanceName = instanceName;
    this.instanceIP = instanceIP;
  }

  pk() {
    return "ID";
  }

  columns() {
    return ["ID INTEGER", "instanceName TEXT", "instanceIP TEXT"];
  }

  name() {
    return "Environment";
  }
}
