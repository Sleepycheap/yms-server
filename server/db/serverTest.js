// import { getOrgCodes } from "./handler.js";

// console.log(await getOrgCodes());

import {
  PopulateOrgCode,
  GetOrgCode,
  GetTrucks,
} from "../oracle/oracleQueries.js";
import { GetCatProdTypeRel } from "../oracle/procedures.js";
import { getColumnNames, insertIntoTable, getOrgCodes } from "./handler.js";
import { db } from "./database.js";

// let array = [];

console.log(await GetTrucks("ANN"));

// function test() {
//   const query = db.prepare("SELECT * FROM OrgCodes");
//   const result = query.all();
//   // console.log("result", result[0].organization_code);
//   let codes = [];
//   for (let i = 0; i < result.length; i++) {
//     const { organization_code } = result[i];
//     codes.push(organization_code);
//   }
//   console.log("codes", codes);
// }
// test();

// for (let i = 0; i < codes.length; i++) {
//   const { ORGANIZATION_CODE } = codes[i];
//   array.push(ORGANIZATION_CODE);
// }

// console.log(codes);

// console.log(array[0]);

// insertIntoTable("OrgCodes", `('${array[0]}')`);

// console.log(getColumnNames("OrgCodes"));

// PopulateOrgCode();

// [["ANN"], ["VIS"], ["JAC"], ["MTY"], ["STJ"], ["RAI"], ["EVA"]];
