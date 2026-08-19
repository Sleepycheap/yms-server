// import { getOrgCodes } from "./handler.js";

// console.log(await getOrgCodes());

import {
  PopulateOrgCode,
  GetOrgCode,
  GetTrucks,
  PopulateTrucks,
} from "../oracle/oracleQueries.js";
// import { GetCatProdTypeRel } from "../oracle/procedures.js";
import {
  getColumnNames,
  insertIntoTable,
  getOrgCodes,
  getTruckList,
  dropTable,
} from "./handler.js";
// import { db } from "./database.js";
import { Trucks } from "../models/Trucks.js";

// console.log(await getTruckList("ANN"));

// dropTable("Trucks");
// Trucks().create;
// PopulateTrucks();

// async function getTrucksPre(orgcode) {
//   let trucks = [];
//   console.log("getting trucks");
//   const list = await GetTrucks(orgcode);
//   for (let i = 0; i < list.length; i++) {
//     const { TRUCK_ID } = list[i];
//     trucks.push(TRUCK_ID);
//   }
//   return trucks;
// }

// async function populateTrucks() {
//   const orgCodes = ["MTY", "STJ", "RAI", "EVA"];
//   console.log("starting populate");
//   const obj = { org: "", truckid: "" };
//   for (let i = 0; i < orgCodes.length; i++) {
//     const trucks = await getTrucksPre(orgCodes[i]);
//     const org = orgCodes[i];
//     for (let i = 0; i < trucks.length; i++) {
//       const newObj = { ...obj, org: org, truckid: trucks[i] };
//       const values = `('${newObj.org}', '${newObj.truckid}')`;
//       // console.log("values", values);
//       insertIntoTable("Trucks", values);
//     }
//   }
// }

// populateTrucks();
// let array = [];
// .console.log(await AllTrucks());

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
