import { DatabaseSync } from "node:sqlite";
import * as types from "./oracle/types.js";
import { populate } from "./db/populateSQL.js";
import { createScacTable, insertScacTable } from "./oracle/functions.js";
import { TypeOverrides } from "pg";
// import { CategoryProductRel } from "./models/CategoryProductRel.js";
const db = new DatabaseSync(":memory:");

export class SQLiteConnection {
  constructor(
    databasePath,
    openFlags = SQLiteOpenFlags.ReadWrite | SQLiteOpenFlags.Create,
    storeDateTimeAsTicks = true,
  ) {
    if (!databasePath) {
      throw new Error("Database path must be specificed!");
    }
    this._open = true;
    this._busyTimeout = 0;
    this._mappings = new Map();
    this._tables = new Map();
    this._sw = null;
    this._elapsedMilliseconds = 0;
    this._transactionDepth = 0;
    this._rand = Math;
    this._handle = null;
    this._databasePath = databasePath;
    this.timeExecution = false;
    this.trace = false;
    this.storeDateTimeAsTicks = false;
  }

  get handle() {
    return this._handle;
  }

  get databasePath() {
    return this._databasePath;
  }

  get tableMappings() {
    return this._tables ? this._tables.values() : [];
  }

  getMapping(type, createFlags = CreateFlags.none) {
    const key = type.name;

    let map = this._mappings.get(key);

    if (!map) {
      map = new TableMapping(type, createFlags);
      this._mappings.set(type.name, map);
    }
    return map;
  }

  static IndexedColumn = class {
    constructor(order, columnName) {
      this.order = order;
      this.columnName = columnName;
    }
  };

  static IndexInfo = class {
    constructor(indexName, tableName, unique, columns) {
      this.indexName = indexName;
      this.tableName = tableName;
      this.unique = false;
      this.columns = [];
    }
  };

  DropTable(table) {
    let map = this.getMapping(table);
    let query = `DROP TABLE IF EXISTS ${map}`;
    return query;
  }

  CreateTable(ty, createFlags = CreateFlags.None) {
    if (!this._tables) {
      this._tables = new Map();
    }
    let map = this._tables.get(ty.name);

    if (!map) {
      map = this.getMapping(ty, createFlags);
      this._tables.set(ty.name, map);
    }
  }
}

/*
  getMapping(type, createFlags = CreateFlags.none) {
    const key = type.name;

    let map = this._mappings.get(key);

    if (!map) {
      map = new TableMapping(type, createFlags);
      this._mappings.set(type.name, map);
    }
    return map;
  }
    */

// const query = sql;

// export const execute = async (db, sql) => {
//   return new Promise((resolve, reject) => {
//     db.exec(sql, (err) => {
//       if (err) reject(err);
//       resolve();
//     });
//   });
// };

async function createTables() {
  const q = populate();
  try {
    db.exec(q);
  } catch (err) {
    console.log(err);
  }
}

createTables();

// const query1 = db.prepare("SELECT * FROM ProductType");
// console.log("query", query1.all());
const insert = db.prepare(
  `INSERT INTO ProductType (ProductTypeID, ProductTypeName) VALUES (?, ?)`,
);

insert.run("1", "Rafter");

const query = db.prepare("SELECT * FROM ProductType");
console.log("Query1", query.all());

export function DeleteAll(tablename) {
  const table = tablename;
  const deleteQuery = `DELETE FROM ${tablename}`;
  return deleteQuery;
}

const del = db.prepare(DeleteAll("ProductType"));

del.run();

console.log("query2", query.all());

/*
INTEGER - Integer
REAL - same as Float
TEXT - string
BLOB - byte image
NULL
*/

/*
const scactable = createScacTable();
const s = CategoryProductRel();

const { g_scac_recordFactory } = types;

function scacTable() {
  const scactable = createScacTable();
  db.exec(scactable);
}

function buildScacTable(scac_code, carrier_name) {
  const scacTableIns = insertScacTable();
  const insert = db.prepare(scacTableIns);
  insert.run(scac_code, carrier_name);
}

async function test() {
  try {
    (createCategoryProductRel(), createScac());
  } catch (err) {
    console.log("Error creating tables", err);
  }
}

CategoryProductRel(db);
*/

// createCategoryProductRel();
// createScac();

// test();
// buildScacTable("PRIJ", "Prime Logistics");

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
