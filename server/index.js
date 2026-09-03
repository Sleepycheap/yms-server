import express from "express";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import { createTable, dropManyTables } from "./db/handler.js";
// import { init } from "./db/populateSQL.js";
import oracleRouter from "./routes/oracle.js";
import apiRouter from "./routes/apiRouter.js";
import propagateRouter from "./routes/propagate.js";
import morgan from "morgan";
import logger from "./utils/logger.js";
// import pino, { destination } from "pino";
const dirname = fileURLToPath(new URL(".", import.meta.url));
const dbPath = join(dirname, "db");
// import corsMiddleWare from "./utils/cors-middleware.js";

const corsOptions = {
  origin: ["http://localhost:5173"],
};
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// init();
// PopulateOrgCode();
// PopulateTrucks()

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
  logger.trace("this is a test");
});

app.all("/", function (req, res, next) {
  (res.header("Access-Control-Allow-Origin", "*"),
    res.header("ACcess-Control-Allow-Headers", "X-Requested-Width"),
    next());
});

app.use("/oracle", oracleRouter);
app.use("/api", apiRouter);
app.use("/propagate", propagateRouter);
