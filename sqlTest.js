import { DatabaseSync } from "node:sqlite";
import * as types from "./oracle/types.js";
import { createScacTable, insertScacTable } from "./oracle/functions.js";

const db = new DatabaseSync(":memory:");
const { g_scac_recordFactory } = types;

/*
INTEGER - Integer
REAL - same as Float
TEXT - string
BLOB - byte image
NULL
*/

// db.exec(`CREATE TABLE g_scac_record(
//   scac_code TEXT PRIMARY KEY,
//   carrier_name TEXT
//   ) STRICT

//   `);

// const insert = db.prepare("INSERT INTO data (key, value) VALUES (?, ?)");

// insert.run(1, "hello");
// insert.run(2, "world");

// const query = db.prepare("SELECT * FROM data ORDER BY key");

// console.log(query.all());

function scacTable() {
  const scactable = createScacTable();
  db.exec(scactable);
}

function buildScacTable(scac_code, carrier_name) {
  const scacTableIns = insertScacTable();
  const insert = db.prepare(scacTableIns);
  insert.run(scac_code, carrier_name);
}

scacTable();
buildScacTable("PRIJ", "Prime Logistics");

const query = db.prepare("SELECT * FROM scactable");
console.log(query.all());
// const { scac_code, carrier_name } = g_scac_recordFactory(
//   "PRIJ",
//   "Prime Logistics",
// );
// const scacTableIns = insertScacTable();
// const insert = db.prepare(scacTableIns);
// insert.run("PRIJ", "Prime Logistics");

// const records = g_scac_recordFactory("PRIJ", "Prime Logistics");
