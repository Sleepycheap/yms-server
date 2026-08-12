import { createTable } from "../db/handler.js";

export function SignatureImg() {
  return {
    name: "SignatureImg",
    columns: ["ID INT", "TruckID TEXT", "SignatureImg BLOB"],
    pk: "ID",

    create: createTable(
      "SignatureImg",
      "ID INT, TruckID TEXT, SignatureImg BLOB",
    ),
  };
}
