import { createTable } from "../db/handler.js";

export function SinglePointOrgMap() {
  return {
    name: "SinglePointOrgMap",
    columns: ["Id INT", "singlePointOrg TEXT", "baseOrg TEXT"],
    pk: "ID",

    create: createTable(
      "SinglePointOrgMap",
      "Id INT, singlePointOrg TEXT, baseOrg TEXT",
    ),
  };
}
