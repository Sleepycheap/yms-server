import { createScacTable } from "../oracle/functions.js";
import { db } from "./database.js";

/*
INTEGER - Integer
REAL - same as Float
TEXT - string
BLOB - byte image
NULL

DROP TABLE removes table from the database
DELETE leaves columns but removes records from the columns. DELETE only needs tablename if all rows are going to be deleted

*/

// syntax: createTable("scactable", "scac_code TEXT, carrier_name TEXT");
export function createTable(table, columns) {
  try {
    const create = db.prepare(
      `CREATE TABLE IF NOT EXISTS ${table}(${columns}) STRICT`,
    );
    const result = create.run();
    console.log(`Table ${table} created successfully`);
  } catch (err) {
    console.error("Error creating table", err.message);
  }
}
// createTable("testtable", "name TEXT, address TEXT");

// dropTable("scactable")
export function dropTable(table) {
  try {
    const q = db.prepare(`DROP TABLE IF EXISTS ${table}`);
    const result = q.run();
    console.log(`Successfully dropped ${table}`, result.changes);
  } catch (err) {
    console.error("Error", err.message);
  }
}

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
  try {
    const insert = db.prepare(
      `INSERT INTO ${table} (${columns}) VALUES ` + values,
    );
    const result = insert.run();
    console.log(`Successfully Updated ${table}! Changes: ${result.changes}`);
  } catch (error) {
    console.log("error", error.message);
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

export function deleteFromTable(table) {
  try {
    const q = db.prepare(`DELETE FROM ${table}`);
    const result = q.run();
    console.log(`Successfully cleared ${table}`);
  } catch (err) {
    console.log(err.message);
  }
}

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

// export async function getUserDetails() {
//   return {
//     FirstName: await getFirstName(),
//     LastName: await getLastName(),
//     PrincipalName: await getPrincipalName(),
//     domainName = await getDomainName()
//   }
// }

// export async function populateOrg() {
//   const organizationCodeList = [];
//   const orgResponse = await GetOrgResponse();
//   for (let i = 0; i < orgResponse.length; i++) {
//     const org_code = [i].orgCode;
//     organizationCodeList.push(org_code)
//   }
//   organizationCodeList.splice(0, 0, org_code)

//   /*
//   Implement some function to get computer name of device. If device name matches Org Code, set that Org Code as default
//   */

// }
