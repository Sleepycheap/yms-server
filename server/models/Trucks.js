import { createTable, dropTable } from "../db/handler.js";

export function Trucks() {
  return {
    name: "Trucks",
    columns: ["TruckID TEXT", "OrgCode TEXT"],
    pk: "TruckID",

    create: createTable("Trucks", "TruckID TEXT, OrgCode TEXT"),
  };
}

dropTable("Trucks");
Trucks().create;
