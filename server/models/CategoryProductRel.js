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

// creates table
//CategoryProductRel().create;

// returns name of table
//CategoryProductRel().name;

//returns array of columns with value type
//CategoryProductRel().columns;

// returns primary key
//CategoryProductRel().pk;
