import express from "express";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import oracledb from "oracledb";
import { DatabaseSync } from "node:sqlite";
import * as types from "./oracle/types.js";
import { createScacTable, insertScacTable } from "./oracle/functions.js";
import "dotenv/config";

import userRouter from "./routes/users.js";
import truckRouter from "./routes/trucks.js";
import itemRouter from "./routes/items.js";
import orderRouter from "./routes/orders.js";
import packageRouter from "./routes/packages.js";
import bodyParser from "body-parser";
import cors from "cors";

const db = new DatabaseSync(":memory:");
const { g_scac_recordFactory } = types;
oracledb.initOracleClient();
const dirname = fileURLToPath(new URL(".", import.meta.url));
const dbPath = join(dirname, "db");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const app = express();

app.use(cors());
app.use(express.static(dbPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

async function initOracle() {
  try {
    const pool = await oracledb.createPool({
      user: process.env.NODE_ORACLEDB_USER,
      password: process.env.NODE_ORACLEDB_PASSWORD,
      connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
    });
    // await pool.close();
    console.log("Connected to Oracle");
  } catch (err) {
    console.log("ERROR:", err);
  }
}

const port = 8080;

initOracle();
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log("YMS Server running on port", port);
});

app.get("/", (req, res) => {
  res.json("you are connected to YMS server");
});
// app.use("/oracle", oracleRouter);
app.use("/packages", packageRouter);
app.use("/orders", orderRouter);

app.use("/users", userRouter);
app.use("/trucks", truckRouter);
app.use("/items", itemRouter);
