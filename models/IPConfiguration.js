export class IPConfiguration {
  constructor(ID, InstanceName, HostAddress, PortNumber) {
    this.ID = ID;
    this.InstanceName = InstanceName;
    this.HostAddress = HostAddress;
    this.PortNumber = PortNumber;
  }

  pk() {
    return "ID";
  }

  columns() {
    return [
      "Id INT",
      "InstanceName TEXT",
      "HostAddress TEXT",
      "PortNumber TEXT",
    ];
  }

  name() {
    return "IPConfiguration";
  }

  IPConfiguration() {
    return {
      instanceName = this.InstanceName,
      hostAddress = this.HostAddress,
      portNumber = this.PortNumber
    }
  }
}
