import { createTable } from "../db/handler.js";

export function Orders() {
  return {
    name: "Orders",
    columns: ["orderNumber INTEGER", "orgCode TEXT"],
    pk: "orderNumber",

    create: createTable("Orders", "orderNumber INTEGER, orgCode TEXT"),
  };
}

Orders().create;
