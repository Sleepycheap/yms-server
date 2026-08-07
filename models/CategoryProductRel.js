import { createTable } from "../db/handler.js";

export function CategoryProductRel() {
  return {
    name: "CategoryProductRel",
    columns: [
      "categoryProductRelID INTEGER",
      "category TEXT",
      "productTypeID INTEGER",
    ],
    pk: "categoryProductRelID",

    create: createTable(
      "CategoryProductRel",
      "categoryProductRelID INTEGER, category TEXT, productTypeID INTEGER",
    ),
  };
}
