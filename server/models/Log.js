import { createTable } from "../db/handler.js";

export function Log() {
  return {
    name: "Log",
    columns: ["ID INT", "LogMessage TEXT", "TimeStamp TEXT"],
    pk: "ID",

    create: createTable("Log", "ID INT, LogMessage TEXT, TimeStamp TEXT"),
  };
}
