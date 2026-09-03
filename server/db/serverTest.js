// import { getOrgCodes } from "./handler.js";

// console.log(await getOrgCodes());

import { pool } from "../oracle/pool.js";

// import {
//   GetTrucks,
//   runVerifyOrder,
//   getLoadingShippingDetails,
// } from "../oracle/oracleQueries.js";
// import {
//   g_shipping_order_details_rec,
//   createGetTruckId,
//   orderNumberType,
// } from "../oracle/types.js";
// // import { GetCatProdTypeRel } from "../oracle/procedures.js";
// import {
//   getColumnNames,
//   insertIntoTable,
//   getOrgCodes,
//   getTruckList,
//   dropTable,
//   getScacCodes,
// } from "./handler.js";
// // import { db } from "./database.js";
// import { Trucks } from "../models/Trucks.js";
// import { OrgCodes } from "../models/OrgCodes.js";

// import {
//   GetTruckID,
//   createOperatingInvIDFunc,
//   createLoadingShippingProc,
//   createGetIPPlant,
//   createCustomTruckIDProc,
//   createCustomGetDesc,
// } from "../oracle/procedures.js";

// const connection = await pool.getConnection();

// console.log(await getLoadingShippingDetails());

import {
  getOrgCodes,
  getTruckIDByOrg,
  getOperatingUnitID,
  validateOrder,
  getLoadingShippingDetails,
  getTruckManifest,
  getLoadedTruckWeight,
  runOrderCreditCheck,
  // runContainerValidation,
  runShowTruck,
  updateTruckID,
  getAllContainersForOrder,
  getCustomerName,
  getTruckID,
  populateTrucks,
} from "../oracle/functions.js";

import {
  populateContainersByOrder,
  getOrderDetails,
  getOrderDetailsNoTruck,
  // deleteFromTable,
  dropTable,
  getScacCodes,
  getContainersByOrder,
} from "./handler.js";

import { db } from "./database.js";
import {
  GetTrucks,
  PopulateTrucks,
  PopulateScac,
} from "../oracle/oracleQueries.js";

// import { GetTrucks } from "../oracle/oracleQueries.js";

// const test = await getLoadingShippingDetails(
//   "ANN",
//   2600429001,
//   "2600429001T1",
//   "S",
//   "NULL",
//   "NULL",
// );

// my user ID is 122452

// const test = await runShowTruck(2600429001, null, "10J", "ANN");
// const test = await getTruckManifest("STJ", "TEST12345 06-14");

// console.log(test);
// SELECT * FROM APPS.XDP_OE_ORDER_DETAILS_V

// const add = await updateTruckID(
//   2600429001,
//   "1FSX",
//   "ANN",
//   "ANN",
//   null,
//   "PRIJ12345 090126",
//   "A",
//   122452,
//   "PRIJ12345 090126",
//   "M",
// );

// console.log("test", test[0].CONT_NAME);

// async function test2() {
//   const test = await getAllContainersForOrder(2600429001);
//   for (let i = 0; i < test.length; i++) {
//     const { CONT_NAME, ITEM_DESCRIPTION } = test[i];
//     console.log("name", CONT_NAME, ITEM_DESCRIPTION);
//   }
// }

// populateContainersByOrder(2600429001);

// console.log(await getAllContainersForOrder(2600429001));
// test2();

// console.log(await getOrderDetailsNoTruck(2600429001));

// console.log(await getCustomerName(2600429001));

// console.log(await populateTrucks("ANN"));
// console.log(deleteFromTable("Trucks"));

// console.log(await PopulateTrucks());
// console.log(await getTruckID("ANN"));

// const test = await GetTrucks("ANN");
// console.log("test", test);

// const test = await getCustomerName(2600429001);

// console.log(test[0]);
// console.log(await PopulateScac());

// console.log(await getScacCodes());
console.log(await getContainersByOrder(2502262301));
