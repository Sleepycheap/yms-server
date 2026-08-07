import { createTable } from "../db/handler.js";

export function GrossObject() {
  return {
    name: "GrossObject",
    columns: [
      "ID INT",
      "truckID TEXT",
      "totalWeight REAL",
      "totalQuantity REAL",
    ],
    pk: "ID",

    create: createTable(
      "GrossObject",
      "ID INT, truckID TEXT, totalWeight REAL, totalQuantity REAL",
    ),
  };
}
