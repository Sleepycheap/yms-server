import { createTable } from "../db/handler.js";
import { GetScac } from "../oracle/oracleQueries.js";

export function ScacTable() {
  return {
    name: "ScacTable",
    columns: ["Scac_Code TEXT", "Carrier_Name TEXT"],
    pk: "ScacCode",

    create: createTable("ScacTable", "Scac_Code TEXT, Carrier_Name TEXT"),
  };
}
