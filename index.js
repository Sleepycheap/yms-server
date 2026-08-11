import express from "express";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import oracledb from "oracledb";
import { DatabaseSync } from "node:sqlite";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import { createTable, dropManyTables } from "./db/handler.js";
import { CreateTables } from "./db/populateSQL.js";
import truckSelectionRouter from "./routes/truckSelectionRouter.js";
import ejs from "ejs";
oracledb.initOracleClient();

const dirname = fileURLToPath(new URL(".", import.meta.url));
const dbPath = join(dirname, "db");
const viewpath = join(dirname, "views");

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const app = express();

app.use(cors());
app.use(express.static(dbPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", viewpath);
app.set("view engine", "ejs");

const tables = [
  "CategoryProductRel",
  "Environment",
  "GrossObject",
  "IPConfiguration",
  "IsPhotoTaken",
  "Log",
  "ProductType",
  "ProductTypeAnswers",
  "ProductTypeQuestions",
  "ScanningItem",
  "SignatureImg",
  "SinglePointOrgMap",
  "TruckImage",
];

// dropManyTables(tables);
// CreateTables();

// async function initOracle() {
//   try {
//     const pool = await oracledb.createPool({
//       user: process.env.NODE_ORACLEDB_USER,
//       password: process.env.NODE_ORACLEDB_PASSWORD,
//       connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
//     });
//     // await pool.close();
//     console.log("Connected to Oracle");
//     return pool;
//   } catch (err) {
//     console.log("ERROR:", err);
//   }
// }

const port = 8080;

// initOracle();

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log("YMS Server running on port", port);
});

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/truckselection", truckSelectionRouter);
