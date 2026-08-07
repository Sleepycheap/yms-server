// import { db } from "./db/handler.js";

import * as db from "../db/handler.js";

import { ProductTypeAnswers } from "../models/ProductTypeAnswers.js";

import { ProductTypeQuestions } from "../models/ProductTypeQuestions.js";

import { ProductType } from "../models/ProductType.js";

import { GrossObject } from "../models/GrossObject.js";

const list = [
  {
    ProductTypeID: 1,
    ProductTypeName: "Rafters",
  },
  {
    ProductTypeID: 2,
    ProductTypeName: "Beams",
  },
];

// console.log(list[0]);

// const table = new ProductType();
// console.log(table.name());
// db.createTable(table.name(), table.columns());
// db.deleteFromTable("ProductType");

// for (let i = 0; i < list.length; i++) {
//   try {
//     const obj = new ProductType();
//     obj.ProductTypeID = list[i].ProductTypeID;
//     obj.ProductTypeName = list[i].ProductTypeName;
//     // const values = `('${obj.ProductTypeID}','${obj.ProductTypeName}')`;
//     db.insertIntoTable(
//       obj.name(),
//       `('${obj.ProductTypeID}','${obj.ProductTypeName}')`,
//     );
//   } catch (err) {
//     console.log("err", err.message);
//   }
// }

db.dropTable("GrossObject");
GrossObject().create;
