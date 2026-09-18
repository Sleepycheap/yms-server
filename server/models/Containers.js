import { createTable, dropTable } from "../db/handler.js";

export function Containers() {
  return {
    name: "Containers",
    columns: [
      "delivery_detail_id INTEGER",
      "order_number INTEGER",
      "cont_name TEXT",
      "cont_qty INTEGER",
      "cont_gross_wt REAL",
      "ship_from_org_code TEXT",
      "direct_truck TEXT",
      "ship_set_name TEXT",
      "item_description TEXT",
    ],
    pk: "delivery_detail_id",

    create: createTable(
      "Containers",
      "delivery_detail_id INTEGER, order_number INTEGER, cont_name TEXT, cont_qty INTEGER, cont_gross_wt REAL, ship_from_org_code TEXT, direct_truck TEXT, ship_set_name TEXT, item_description TEXT",
    ),
  };
}

// dropTable("Containers");
// Containers().create;
