import { createTable } from "../db/handler.js";

export function IPConfiguration() {
  return {
    name: "IPConfiguration",
    columns: [
      "ID INT",
      "InstanceName TEXT",
      "HostAddress TEXT",
      "PortNumber TEXT",
    ],
    pk: "ID",

    create: createTable(
      "IPConfiguration",
      "ID INT, InstanceName TEXT, HostAddress TEXT, PortNumber TEXT",
    ),
  };
}
