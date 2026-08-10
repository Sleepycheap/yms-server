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

// db.dropTable("GrossObject");
// GrossObject().create;

const test = db.createProductType();
console.log(test);
/*
const oracledb = require('oracledb');

const mypw = ... // the hr schema password

async function(run){
    await using pool = await oracledb.createPool({
        user : "hr",
        password: process.env.PW,
        connectString : "localhost/FREEPDB1",
        poolMin: 1,
        poolMax: 5
    });

    await using connection = await pool.getConnection();

    const { resultSet } = await connection.execute(
        `SELECT department_id, department_name FROM departments
         ORDER BY department_id`,
        [], // no bind variables
        {
          resultSet: true,
        }
    );

    await using rs = resultSet;
    let row;
    let i = 1;

    while ((row = await rs.getRow())) {
      console.log("getRow(): row " + i++);
      console.log(row);
    }
}
run();
*/
