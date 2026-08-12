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
import oracleRouter from "./routes/oracle.js";
oracledb.initOracleClient();

const dirname = fileURLToPath(new URL(".", import.meta.url));
const dbPath = join(dirname, "db");
// const viewpath = join(dirname, "views");

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.static(join(dirname, "client/yms-client/src")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// app.set("views", viewpath);
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

const port = 8080;

// initOracle();

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log("YMS Server running on port", port);
});

app.get("/", (req, res) => {
  res.status(200).send("You are connected to the backend");
});

// app.use("/tables", tableRouter);

// app.user("/trucks", truckRouter);

app.use("/truckselection", truckSelectionRouter);

app.use("/api", oracleRouter);
