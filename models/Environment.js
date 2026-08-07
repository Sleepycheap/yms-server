import { createTable } from "../db/handler.js";

export function Environment() {
  return {
    name: "Environment",
    columns: ["ID INTEGER", "instanceName TEXT", "instanceIP TEXT"],

    pk: "ID",

    create: createTable(
      "Environment",
      "ID INTEGER, instanceName TEXT, instanceIP TEXT",
    ),
  };
}
