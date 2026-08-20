import { createTable } from "../db/handler.js";
import { GetScac } from "../oracle/oracleQueries.js";

export function ScacTable() {
  return {
    name: "ScacTable",
    columns: ["ScacCode TEXT", "CarrierName TEXT"],
    pk: "ScacCode",

    create: createTable("ScacTable", "ScacCode TEXT, CarrierName TEXT"),
  };
}
