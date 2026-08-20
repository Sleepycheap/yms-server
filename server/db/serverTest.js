// import { getOrgCodes } from "./handler.js";

// console.log(await getOrgCodes());

import {
  PopulateOrgCode,
  GetOrgCode,
  GetTrucks,
  PopulateTrucks,
  GetScac,
} from "../oracle/oracleQueries.js";
// import { GetCatProdTypeRel } from "../oracle/procedures.js";
import {
  getColumnNames,
  insertIntoTable,
  getOrgCodes,
  getTruckList,
  dropTable,
  getScacCodes,
} from "./handler.js";
// import { db } from "./database.js";
import { Trucks } from "../models/Trucks.js";

// async function Test() {
//   const list = await GetScac();
//   for (let i = 0; i < list.length; i++) {
//     const { SCAC_CODE } = list[i];
//     const { CARRIER_NAME } = list[i];
//     const values = `('${SCAC_CODE}', '${CARRIER_NAME}')`;
//     insertIntoTable("ScacTable", values);
//     // console.log(values);
//   }
// }
