// import { createScacTable } from "../oracle/functions.js";
// import { GetTrucks } from "../oracle/oracleQueries.js";
import { db } from "./database.js";
import { pool } from "../oracle/pool.js";
import {
  getPickedContainersForOrder,
  getOrgCodes as getCodes,
  getScacCodesByOrg,
  getTruckID,
} from "../oracle/functions.js";

/*
INTEGER - Integer
REAL - same as Float
TEXT - string
BLOB - byte image
NULL

DROP TABLE removes table from the database
DELETE leaves columns but removes records from the columns. DELETE only needs tablename if all rows are going to be deleted

*/
// returns all from producttype
export async function getProductTypes() {
  try {
    const query = db.prepare("SELECT * FROM ProductType");
    query.raw(true);
    const result = query.all();
    return result;
  } catch (err) {
    console.log("error", err.message);
  }
}

/*
returns order details for specific order number
this function aggregates each row with the same cont_name into an individual row with total qty and total_gross_wt
the item description is set by the first delivery_detail_id for each container
*/
export async function getOrderDetailsAll() {
  try {
    const query = db.prepare(
      // `SELECT cont_name, GROUP_CONCAT(item_description, ';') AS items, SUM(cont_qty) AS total_qty, SUM(cont_gross_wt) AS total_gross_wt, COUNT(*) AS ITEM_COUNT, ORDER_NUMBER FROM Containers GROUP BY cont_name, order_number ORDER BY cont_name`,
      `WITH ranked AS (SELECT *, ROW_NUMBER() OVER (
        PARTITION BY CONT_NAME ORDER BY cont_name) AS rn FROM Containers)
        SELECT order_number, cont_name, item_description, SUM(cont_qty) OVER (PARTITION BY cont_name) AS total_qty,
        SUM(cont_gross_wt) OVER (PARTITION BY cont_name) AS total_gross_wt, direct_truck FROM ranked WHERE rn = 1 AND order_number = ?`,
    );
    const result = query.all(2600429001);
    return result;
  } catch (err) {
    console.log("error getting order details", err.msh);
  }
}

// returns order details for containers that have not been assigned a truck id
export async function getOrderDetailsPicked(orderNumber) {
  try {
    const query = db.prepare(
      // `SELECT cont_name, GROUP_CONCAT(item_description, ';') AS items, SUM(cont_qty) AS total_qty, SUM(cont_gross_wt) AS total_gross_wt, COUNT(*) AS ITEM_COUNT, ORDER_NUMBER FROM Containers GROUP BY cont_name, order_number ORDER BY cont_name`,
      `WITH ranked AS (SELECT *, ROW_NUMBER() OVER (
        PARTITION BY CONT_NAME ORDER BY cont_name) AS rn FROM Containers)
        SELECT order_number, cont_name, item_description, SUM(cont_qty) OVER (PARTITION BY cont_name) AS total_qty,
        SUM(cont_gross_wt) OVER (PARTITION BY cont_name) AS total_gross_wt, direct_truck FROM ranked WHERE rn = 1 AND order_number = ? AND direct_truck IS NULL AND cont_name IS NOT NULL`,
    );
    const result = query.all(orderNumber);
    return result;
  } catch (err) {
    console.log("error getting order details", err.msh);
  }
}

// returns order details for containers that have been assigned a truck id
export async function getOrderDetailsLoaded(orderNumber) {
  try {
    const query = db.prepare(
      `WITH ranked AS (SELECT *, ROW_NUMBER() OVER (
        PARTITION BY CONT_NAME ORDER BY cont_name) AS rn FROM Containers)
        SELECT order_number, cont_name, item_description, SUM(cont_qty) OVER (PARTITION BY cont_name) AS total_qty,
        SUM(cont_gross_wt) OVER (PARTITION BY cont_name) AS total_gross_wt, direct_truck FROM ranked WHERE rn = 1 AND order_number = ? AND direct_truck IS NOT NULL AND cont_name IS NOT NULL`,
    );
    const result = query.all(orderNumber);
    return result;
  } catch (err) {
    console.log("error getting order details", err.msh);
  }
}

export async function getOrderDetailsUnpicked(orderNumber) {
  try {
    const query = db.prepare(
      // `SELECT cont_name, GROUP_CONCAT(item_description, ';') AS items, SUM(cont_qty) AS total_qty, SUM(cont_gross_wt) AS total_gross_wt, COUNT(*) AS ITEM_COUNT, ORDER_NUMBER FROM Containers GROUP BY cont_name, order_number ORDER BY cont_name`,
      // `WITH ranked AS (SELECT *, ROW_NUMBER() OVER (
      //   PARTITION BY CONT_NAME ORDER BY delivery_detail_id) AS rn FROM Containers)
      //   SELECT order_number, cont_name, item_description, SUM(cont_qty) OVER (PARTITION BY cont_name) AS total_qty,
      //   SUM(cont_gross_wt) OVER (PARTITION BY cont_name) AS total_gross_wt, direct_truck FROM ranked WHERE rn = 1 AND order_number = ? AND direct_truck IS NULL AND cont_name IS NULL`,
      `SELECT * FROM Containers WHERE direct_truck IS NULL AND cont_name IS NULL AND order_number = ?`,
    );
    const result = query.all(orderNumber);
    return result;
  } catch (err) {
    console.log("error getting order details", err.msh);
  }
}

// populates local tables with container data from Oracle
export async function populateContainersByOrder(orderNumber) {
  let changes = 0;
  const containers = await getPickedContainersForOrder(orderNumber);
  try {
    for (let i = 0; i < containers.length; i++) {
      const {
        DELIVERY_DETAIL_ID,
        CONT_NAME,
        ITEM_DESCRIPTION,
        CONT_QTY,
        CONT_GROSS_WT,
        DIRECT_TRUCK,
        ORDER_NUMBER,
      } = containers[i];
      const values = `('${DELIVERY_DETAIL_ID}', '${CONT_NAME}', '${ITEM_DESCRIPTION}', '${CONT_QTY}', '${CONT_GROSS_WT}', '${DIRECT_TRUCK}', '${ORDER_NUMBER}')`;
      insertIntoTable("Containers", values);
      changes++;
    }
  } catch (err) {
    console.log("there was an error populating containers", err.msg);
  }
  console.log(`Updated Containers with ${changes} total chnages`);
}

export async function getContainersByOrder(orderNumber) {
  try {
    const query = db.prepare(`SELECT * FROM Containers WHERE order_number = ?`);
    const result = query.all(orderNumber);
    return result;
  } catch (err) {
    console.log("error getting containers", err.msg);
  }
}

export async function getContNameByDescription(itemDescription) {
  try {
    const query = db.prepare(
      `SELECT cont_name FROM Containers WHERE item_description = ?`,
    );
    const result = query.all(itemDescription);
    return result;
  } catch (err) {
    console.log("error getting contname", err.message);
    return { "error getting contname": err.message };
  }
}

export async function getDescriptionByContName(contName) {
  try {
    const query = db.prepare(
      `SELECT item_description FROM Containers WHERE cont_name = ?`,
    );
    const result = query.all(contName);
    return result;
  } catch (err) {
    console.log("error getting description", err.message);
    return { "error getting description": err.message };
  }
}

export async function getContainerByID(id) {
  try {
    const query = db.prepare(
      `SELECT * FROM Containers WHERE delivery_detail_id = ?`,
    );
    const result = query.all(id);
    console.log("result", result);
    return result;
  } catch (err) {
    console.log("error getting container", err.message);
    return { "error getting container": err.message };
  }
}

export async function getOrgCodes() {
  let codes = [];
  try {
    const query = db.prepare("SELECT * FROM OrgCodes");
    // .raw tell query to return arrays instead of objects
    // query.raw(true);
    const result = query.all();
    for (let i = 0; i < result.length; i++) {
      const { organization_code } = result[i];
      codes.push(organization_code);
    }
    return codes;
  } catch (err) {
    console.log("error", err.message);
  }
}

export async function getTruckList(orgcode) {
  try {
    const query = db.prepare(`SELECT * FROM Trucks WHERE OrgCode = ?`);
    const result = query.all(orgcode);
    return result;
  } catch (err) {
    console.log("error getting truck list", err.message);
  }
}

export async function getAllTrucks() {
  try {
    const query = db.prepare(`SELECT * FROM Trucks`);
    const result = query.all();
    return result;
  } catch (err) {
    console.log(`error getting all trucks`, err.message);
  }
}

export async function getScacCodes() {
  let array = [];
  try {
    const query = db.prepare(`SELECT scac_code FROM ScacTable`);
    const result = query.all();
    for (let i = 0; i < result.length; i++) {
      const { Scac_Code } = result[i];
      array.push(Scac_Code);
    }
    return array;
  } catch (err) {
    console.log("Error getting Scac Code", err.message);
  }
}

// console.log(await getProductTypes());

// syntax: createTable("scactable", "scac_code TEXT, carrier_name TEXT");
export function createTable(table, columns) {
  try {
    const create = db.prepare(
      `CREATE TABLE IF NOT EXISTS ${table}(${columns}) STRICT`,
    );
    const result = create.run();
    console.log(`Table ${table} created successfully`);
    console.log(result);
  } catch (err) {
    console.error("Error creating table", err.message);
  }
}
// createTable("testtable2", "name TEXT, address TEXT");

export function createProductType() {
  try {
    const create = db.prepare(
      `CREATE TABLE IF NOT EXISTS 'ProductType' (ProductTypeID INTEGER, ProductTypeName TEXT) STRICT `,
    );
    const result = create.run();
    console.log(`ProductType table created successfully`);
  } catch (err) {
    console.log("PTcreate error", err.message);
  }
}

// dropTable("scactable")
export function dropTable(table) {
  try {
    const q = db.prepare(`DROP TABLE IF EXISTS ${table}`);
    const result = q.run();
    const r = `Successfully dropped ${table}`;
    console.log(`Successfully dropped ${table}`, result.changes);
    return result;
  } catch (err) {
    console.error("Error", err.message);
  }
}

// export function deleteFromTable(table) {
//   try {
//     const q = db.prepare(`DELETE FROM ?`);
//     const result = q.run(table);
//     console.log(`Successfully deleted all rows from ${table}`);
//     return result;
//   } catch (err) {
//     console.log("there was an error deleting from table", err.message);
//   }
// }

// dropManyTables(['scactable', 'truck_id']);
export function dropManyTables(tables) {
  try {
    for (const table of tables) {
      const q = db.prepare(`DROP TABLE IF EXISTS ${table}`);
      const result = q.run();
      console.log(`Successfully dropped ${table}`);
    }
  } catch (err) {
    console.error("error", err.message);
  }
}

//const values = "('RYNL', 'Ryno Logistics')";
// insertIntoTable("scactable", values);
export function insertIntoTable(table, values) {
  const columns = getColumnNames(table);
  // console.log("columns", columns);
  try {
    const insert = db.prepare(
      `INSERT INTO ${table} (${columns}) VALUES ` + values,
    );
    const result = insert.run();
    console.log(`Successfully Updated ${table}! Changes: ${result.changes}`);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

// gets names of all columns in table
export function getColumnNames(table) {
  try {
    const c = db.prepare(`PRAGMA table_info(${table})`).all();
    let columnName = [];
    for (let i = 0; i < c.length; i++) {
      const column = c[i].name;
      columnName.push(column);
    }
    return columnName;
  } catch (err) {
    console.log(err.message);
  }
}

// gets all info for all columns in table
export function getColumns(table) {
  const result = db.prepare(`PRAGMA table_info(${table})`).all();
  return result;
}

// export function deleteFromTable(table) {
//   try {
//     const q = db.prepare(`DELETE FROM ${table}`);
//     const result = q.run();
//     console.log(`Successfully cleared ${table}`);
//   } catch (err) {
//     console.log(err.message);
//   }
// }

export function deleteFromMany(tables) {
  try {
    for (const table of tables) {
      const q = db.prepare(`DELETE FROM ${table}`);
      const result = q.run();
      console.log(`Successfully cleared ${table}`);
    }
  } catch (err) {
    console.error("error", err.message);
  }
}
// deleteFromMany(["scactable", "testtable"]);

export function getTruckResponseTruck() {
  const truckId = "truck id from api";
  return {
    truckIdField: truckId,
    changed: true,
  };
}

export class TableMapping {
  constructor(model) {
    this.tableName = model.name;
    this.columns = Object.keys(new model());
    this.primaryKey = this.columns[0];
    this.getByPrimaryKeySql = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
  }
}
//const map = new TableMapping(ProductTypeAnswers);
//map.tableName returns TableName of table model passed into tablemapping function

//
export async function PopulateOrgCode() {
  const list = await getCodes();
  console.log("list", list);
  let changes = 0;
  try {
    for (let i = 0; i < list.length; i++) {
      try {
        const { ORGANIZATION_CODE } = list[i];
        const { ORGANIZATION_ID } = list[i];
        const result = insertIntoTable(
          "OrgCodes",
          `('${ORGANIZATION_ID}', '${ORGANIZATION_CODE}')`,
        );
        changes++;
      } catch (err) {
        console.log("Org Codes list error", err.message);
      }
    }
  } catch (err) {
    console.log("Org Codes fn error", err.message);
  }
  console.log(`Updated OrgCodes with ${changes} total changes`);
}

export async function PopulateTrucks() {
  const orgCodes = ["ANN", "VIS", "JAC", "MTY", "STJ", "RAI", "EVA"];
  console.log("starting populate");
  const obj = { org: "", truckid: "" };
  const del = db.prepare("DELETE FROM Trucks");
  del.run();
  try {
    for (let i = 0; i < orgCodes.length; i++) {
      const trucks = await getTruckIDByOrg(orgCodes[i]);
      const org = orgCodes[i];
      for (let i = 0; i < trucks.length; i++) {
        const { TRUCK_ID } = trucks[i];
        const newObj = { ...obj, org: org, truckid: TRUCK_ID };
        console.log("obj", newObj);
        const values = `('${newObj.truckid}', '${newObj.org}')`;
        console.log("values", values);
        insertIntoTable("Trucks", values);
        console.log(`populate finished for ${org}`);
      }
    }
  } catch (err) {
    console.log("error populating trucks", err.message);
  }
}

export async function PopulateScac() {
  const del = db.prepare("DELETE FROM ScacTable");
  del.run();
  const result = await getScacCodesByOrg();
  console.log("result", result);
  try {
    for (let i = 0; i < result.length; i++) {
      const { SCAC_CODE } = result[i];
      const { CARRIER_NAME } = result[i];
      // console.log(SCAC_CODE, CARRIER_NAME);
      const values = `('${SCAC_CODE}', '${CARRIER_NAME.replace(/'/g, "")}')`;
      console.log("values", values);
      insertIntoTable("ScacTable", values);
      // console.log("scac tables populated");
    }
  } catch (err) {
    console.log("error populating scac", err.message);
  }
}
