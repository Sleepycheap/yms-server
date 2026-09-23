import { pool } from "../oracle/pool.js";
import axios from "axios";

import {
  getOrgCodes,
  getTruckIDByOrg,
  getOperatingUnitID,
  validateOrder,
  getLoadingShippingDetails,
  // getTruckManifest,
  getLoadedTruckWeight,
  runOrderCreditCheck,
  // runContainerValidation,
  // runShowTruck,
  updateTruckID,
  getAllContainersForOrder,
  getCustomerName,
  getTruckID,
  populateTrucks,
  getAllOrdersByOrg,
  creditCheck,
  // propagateOrders,
  verifyContainer,
  // runOrderOnHold,
  getUserID,
  uploadTruckImage,
  getTruckImage,
  // truckImageTable,
  getUnpickedContainersForOrder,
  runTruckManifest,
  getPromiseDate,
} from "../oracle/functions.js";

import {
  populateContainersByOrder,
  // getOrderDetails,
  // getOrderDetailsNoTruck,
  // deleteFromTable,
  getOrderDetailsAll,
  getOrderDetailsLoaded,
  getOrderDetailsPicked,
  getOrderDetailsUnpicked,
  dropTable,
  getScacCodes,
  getContainersByOrder,
  getContainerByID,
} from "./handler.js";

import { db } from "./database.js";
import {
  GetTrucks,
  PopulateTrucks,
  PopulateScac,
} from "../oracle/oracleQueries.js";
import { getWeight } from "../../client/yms-client/src/utils/apiFunctions.js";
import oracledb from "oracledb";

import { fileTypeFromBuffer, fileTypeFromFile } from "file-type";
import { readChunk } from "read-chunk";

import fs from "node:fs";
import { join } from "node:path";
import { Buffer } from "node:buffer";
import { fileURLToPath } from "node:url";
import { imageSize } from "image-size";
const dirname = fileURLToPath(new URL(".", import.meta.url));

const imagePath = join(dirname, "Truck1.jpg");

const image2 = join(dirname, "Truck2.jpg");

// const otherPath = join(dirname, "available packages.png");

// console.log(dirname);

// console.log(otherPath);
const imageBuffer = fs.readFileSync(image2);
// console.log(typeof imageBuffer);

const imageObject = {
  truck_id: "2600429001T1",
  user_id: 122452,
  truck_image: "Truck2.jpg",
};

// const connection = await pool.getConnection();
const test = await uploadTruckImage(imageObject);

console.log(test);

// const RecType = await connection.getDbObjectClass(
//   "INTERFACE.XXBBNA_WAREHOUSE_PROCESS_PKG.TRUCK_IMAGE_REC",
// );

// console.log(RecType._objType.attributes);

// RecType._objType.attributes
// [
//   {
//     name: 'TRUCK_ID',
//     type: [DbType DB_TYPE_VARCHAR],
//     maxSize: 30,
//     typeName: 'VARCHAR2'
//   },
//   {
//     name: 'USER_ID',
//     type: [DbType DB_TYPE_NUMBER],
//     precision: 0,
//     scale: -127,
//     typeName: 'NUMBER',
//     converter: [Function: defaultNumberConverter]
//   },
//   {
//     name: 'TRUCK_IMAGE',
//     type: [DbType DB_TYPE_BLOB],
//     typeName: 'BLOB'
//   }
// ]

// const TableType = await connection.getDbObjectClass(
//   "INTERFACE.XXBBNA_WAREHOUSE_PROCESS_PKG.TRUCK_IMAGE_TBL",
// );

// const rec = new RecType({
//   TRUCK_ID: "2600429001T1",
//   USER_ID: 122452,
//   TRUCK_IMAGE: imageBuffer,
// });

// const tbl = new TableType();

// tbl.append(rec);

// console.log(tbl);

// async function testTypes() {
//   const connection = await pool.getConnection();
//   const ImageType = await connection.getDbObjectClass(
//     "INTERFACE.XXBBNA_WAREHOUSE_PROCESS_PKG.TRUCK_IMAGE_REC",
//   );
//   const TestType = await connection.getDbObjectClass(
//     "INTERFACE.XXBBNA_WAREHOUSE_PROCESS_PKG.G_LOADED_TRUCK_DETAILS_REC",
//   );
//   console.log(ImageType);
// }

// testTypes();

// console.log(
//   await getLoadingShippingDetails(
//     "ANN",
//     2600429001,
//     "2600429001T1",
//     "A",
//     null,
//     "MAY-15-26",
//   ),
// );

// console.log(await getContainerByID(122940557));

// console.log(await getOperatingUnitID("ANN"));

// console.log(await validateOrder("ANN", 2600429001));

// console.log(await getAllContainersForOrder(2600429001));

// console.log(await getUnpickedContainersForOrder(2600429001));

// console.log(await getOrderDetailsLoaded(2600429001));

// console.log(await runTruckManifest("THE", "ACMAK652"));

// console.log(await getPromiseDate(2600429001));

// console.log(await )

// console.log(test);
// console.log(await validateOrder(41, 2600429069));

// console.log(await verifyContainer(2600429001, "10JJJJs"));

// const buffer = Buffer.from(imagePath, {});

// console.log(imageBuffer);

// const image = await getTruckImage(122452);
// const { TRUCK_IMAGE } = image[0];

// console.log(TRUCK_IMAGE, CREATION_DATE);
// console.log(image);

// console.log(await fileTypeFromFile(TRUCK_IMAGE));

// console.log(image);

// console.log(await fileTypeFromBuffer(TRUCK_IMAGE));

// const dimensions = imageSize(TRUCK_IMAGE);
// console.log(dimensions);

// const imageBlob = new Blob([imagePath], { type: "image/jpg" });

// console.log(imageBlob);
// const imageBuffer = fs.readFileSync(otherPath);
// console.log(imageBuffer);

// const imageObject = {
//   TRUCK_ID: "2600429001T2",
//   USER_ID: 122452,
//   TRUCK_IMAGE: imageBuffer,
// };
// console.log("test", await uploadTruckImage(imageObject));

// const table = await truckImageTable(data);

// console.log(table);

// const truckImage = await uploadTruckImage(imageObject);
// console.log("test", truckImage);
/*

[
  {
    TRUCK_ID: '2600429001T1',
    TRUCK_IMAGE: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 60 00 60 00 00 ff e1 30 ca 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 04 01 31 00 02 00 00 00 0b 00 00 ... 49107 more bytes>,
    CREATED_BY: 122452,
    CREATION_DATE: 2026-08-26T20:02:32.000Z,
    LAST_UPDATE_DATE: 2026-08-26T20:02:32.000Z,
    LAST_UPDATED_BY: 122452
  },
  {
    TRUCK_ID: '2600429001T1',
    TRUCK_IMAGE: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 60 00 60 00 00 ff e1 30 ca 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 04 01 31 00 02 00 00 00 0b 00 00 ... 49107 more bytes>,
    CREATED_BY: 122452,
    CREATION_DATE: 2026-08-26T20:04:30.000Z,
    LAST_UPDATE_DATE: 2026-08-26T20:04:30.000Z,
    LAST_UPDATED_BY: 122452
  },
  {
    TRUCK_ID: 'PRIJ12345 082626',
    TRUCK_IMAGE: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 60 00 60 00 00 ff e1 30 ca 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 04 01 31 00 02 00 00 00 0b 00 00 ... 49107 more bytes>,
    CREATED_BY: 122452,
    CREATION_DATE: 2026-08-26T20:09:19.000Z,
    LAST_UPDATE_DATE: 2026-08-26T20:09:19.000Z,
    LAST_UPDATED_BY: 122452
  },
  {
    TRUCK_ID: 'PRIJ12345 090126',
    TRUCK_IMAGE: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 60 00 60 00 00 ff e1 30 ca 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 04 01 31 00 02 00 00 00 0b 00 00 ... 49107 more bytes>,
    CREATED_BY: 122452,
    CREATION_DATE: 2026-09-01T16:14:03.000Z,
    LAST_UPDATE_DATE: 2026-09-01T16:14:03.000Z,
    LAST_UPDATED_BY: 122452
  },
  {
    TRUCK_ID: '2600429001T1',
    TRUCK_IMAGE: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 60 00 60 00 00 ff e1 30 ca 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 04 01 31 00 02 00 00 00 0b 00 00 ... 49103 more bytes>,
    CREATED_BY: 122452,
    CREATION_DATE: 2026-09-10T19:58:34.000Z,
    LAST_UPDATE_DATE: 2026-09-10T19:58:34.000Z,
    LAST_UPDATED_BY: 122452
  }
]

*/

// console.log(await getTruckImages());
// const b = test[0].TRUCK_IMAGE;

// const buffer = await blob.arrayBuffer();

// testBlob();

// console.log(TestType.prototype);

// const imgBuffer = fs.readFileSync(imagePath);

// const connection = await pool.getConnection();

// const TestType = await connection.getDbObjectClass(
//   "INTERFACE.XXBBNA_WAREHOUSE_PROCESS_PKG.G_TRUCK_IMG_RECORD",
// );
// console.log("TT", TestType);

// const g_truck_img = ["2600429001T1", 122452, imgBuffer];

// const g_truck = new TestType({
//   TRUCK_ID: "2600429001T1",
//   USER_ID: 122452,
//   TRUCK_IMAGE: imgBuffer,
// });

// const g_truck = {
//   TRUCK_ID: "2600429001T1",
//   USER_ID: 122452,
//   TRUCK_IMAGE: imgBuffer,
// };

// console.log("gtruck", g_truck);

// const TableType = await connection.getDbObjectClass(
//   "INTERFACE.XXBBNA_WAREHOUSE_PROCESS_PKG.TRUCKIMGTABLE",
// );

// // console.log(g_truck.TRUCK_ID);

// async function uploadTruckImage(imageObject) {
//   const { TRUCK_ID, USER_ID, TRUCK_IMAGE } = imageObject;
//   try {
//     const connection = await pool.getConnection();
//     const result = await connection.execute(
//       `
//       INSERT INTO XXBBNA_TRUCK_IMAGE (truck_id, truck_image, created_by, creation_date, last_update_date, last_updated_by) VALUES (:p1, :p2, :p3, SYSDATE, SYSDATE, :p6)`,
//       [TRUCK_ID, TRUCK_IMAGE, USER_ID, USER_ID],
//     );
//     const { rows } = result;
//     return rows;
//   } catch (err) {
//     console.log("there was an error uploading truck image", err.message);
//   }
// // }

// const test = await uploadTruckImage(g_truck);
// console.log(test);

// const truckImage = new TestType({
//   TRUCK_ID: "2600429001T1",
//   USER_ID: 122452,
//   TRUCK_IMAGE: imgBuffer,
// });

// const table = new TableType({
//   TRUCK_ID: truckImage.TRUCK_ID,
//   USER_ID: truckImage.USER_ID,
//   TRUCK_IMAGE: truckImage.TRUCK_IMAGE,
// });

// console.log("table", table);

// console.log(await uploadTruckImage(g_truck));

// const test = async () => {
//   try {
//     const connection = await pool.getConnection();
//     const result = await connection.execute(
//       `SELECT * FROM XXBBNA_TRUCK_IMAGE WHERE CREATED BY = :id`,
//       [122452],
//     );
//     const { rows } = result;
//     return rows;
//   } catch (err) {
//     console.log("there was an error", err.message);
//   }
// };

// console.log(await truckImage());
