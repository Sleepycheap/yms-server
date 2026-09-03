import { createTable, dropTable } from "../db/handler.js";

export function Containers() {
  return {
    name: "Containers",
    columns: [
      "delivery_detail_id INTEGER",
      "cont_name TEXT",
      "item_description TEXT",
      "cont_qty INTEGER",
      "cont_gross_wt REAL",
      "direct_truck TEXT",
      "order_number INTEGER",
      "shipping_instructions TEXT",
    ],
    pk: "delivery_detail_id",

    create: createTable(
      "Containers",
      "delivery_detail_id INTEGER, cont_name TEXT, item_description TEXT, cont_qty INTEGER, cont_gross_wt REAL, direct_truck TEXT, order_number INTEGER, shipping_instructions TEXT",
    ),
  };
}

// dropTable("Containers");
// Containers().create;
