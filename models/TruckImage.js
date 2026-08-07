import { createTable } from "../db/handler.js";

export function TruckImage() {
  return {
    name: "TruckImage",
    columns: [
      "ID INT",
      "TruckID TEXT",
      "IsSelected INTEGER",
      "TruckImg BLOB",
      "IsUploaded TEXT",
    ],
    pk: "ID",

    create: createTable(
      "TruckImage",
      "ID INT, TruckID TEXT, IsSelected INTEGER, TruckImg BLOB, IsUploaded TEXT",
    ),
  };
}
