import express from "express";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import oracledb from "oracledb";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import { createTable, dropManyTables } from "./db/handler.js";
import { CreateTables } from "./db/populateSQL.js";
import truckSelectionRouter from "./routes/truckSelectionRouter.js";
import oracleRouter from "./routes/oracle.js";
import apiRouter from "./routes/apiRouter.js";
import { PopulateOrgCode } from "./oracle/oracleQueries.js";
// oracledb.initOracleClient();

const dirname = fileURLToPath(new URL(".", import.meta.url));
const dbPath = join(dirname, "db");

const corsOptions = {
  origin: ["http://localhost:5173"],
};

// oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const app = express();

app.use(cors(corsOptions));

app.use(express.json());

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
dropManyTables(tables);
CreateTables();
PopulateOrgCode();

// function init(tables) {
//   try {
//   } catch (err) {
//     console.log("there was an error starting the app", err.message);
//   }
// }
// init();

const port = 8080;

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log("YMS Server running on port", port);
});

app.get("/", (req, res) => {
  res.status(200).send("You are connected to the backend");
});

app.use("/oracle", oracleRouter);
app.use("/api", apiRouter);
