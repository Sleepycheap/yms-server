import { createTable } from "../db/handler.js";

export function ProductType() {
  return {
    name: "ProductType",
    columns: ["ProductTypeID INTEGER", "ProductTypeName TEXT"],
    pk: "ProductTypeID",

    create: createTable(
      "ProductType",
      "ProductTypeID INTEGER, ProductTypeName TEXT",
    ),
  };
}
