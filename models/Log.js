export class Log {
  constructor(ID, LogMessage, TimeStamp) {
    this.ID = ID;
    this.LogMessage = LogMessage;
    this.TimeStamp = TimeStamp;
  }

  pk() {
    return "ID";
  }

  columns() {
    return [
      "Id INT",
      "LogMessage TEXT",
      "TimeStamp TEXT"
    ];
  }

  name() {
    return "Log";
  }

  Log() {
    return {
      timeStamp = this.LogMessage,
      TimeStamp = new Date().toLocaleString()
    }
  }
}
