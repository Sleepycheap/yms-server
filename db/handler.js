import { createScacTable } from "../oracle/functions.js";
import { db } from "./database.js";

// syntax: createTable("scactable", "scac_code TEXT PRIMARY KEY, carrier_name TEXT");
//This creates the standard RowID as well an autoincrementing column following tablename_ID syntax
export function createTable(table, columns) {
  try {
    const create = db.prepare(
      `CREATE TABLE IF NOT EXISTS ${table}(${table}_ID INTEGER PRIMARY KEY AUTOINCREMENT, ${columns}) STRICT`,
    );
    const result = create.run();
    console.log(`Table ${table} created successfully`);
  } catch (err) {
    console.error("Error", err.message);
  }
}
createTable("testtable", "name TEXT, address TEXT");

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
  const c = db.prepare(`PRAGMA table_info(${table})`).all();
  let columnName = [];
  for (let i = 0; i < c.length; i++) {
    const column = c[i].name;
    columnName.push(column);
  }
  return columnName;
}

// gets all info for all columns in table
export function getColumns(table) {
  const result = db.prepare(`PRAGMA table_info(${table})`).all();
  return result;
}
