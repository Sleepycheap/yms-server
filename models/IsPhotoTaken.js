import { createTable } from "../db/handler.js";

export function IsPhotoTaken() {
  return {
    name: "IsPhotoTaken",
    columns: ["totalCount INT"],
    pk: "ID",

    create: createTable("IsPhotoTaken", "totalCount INT"),
  };
}
