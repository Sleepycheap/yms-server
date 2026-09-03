import { createTable, dropTable } from "../db/handler.js";

export function OrgCodes() {
  return {
    name: "OrgCodes",
    columns: ["organization_id INTEGER", "organization_code TEXT"],
    pk: "organization_id",

    create: createTable(
      "OrgCodes",
      "organization_id INTEGER, organization_code TEXT",
    ),
  };
}

// dropTable("OrgCodes");
// OrgCodes().create;
