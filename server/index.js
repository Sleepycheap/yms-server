import express from "express";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import fs from "node:fs";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import { createTable, dropManyTables } from "./db/handler.js";
// import { init } from "./db/populateSQL.js";
import oracleRouter from "./routes/oracle.js";
import apiRouter from "./routes/apiRouter.js";
import propagateRouter from "./routes/propagate.js";
import morgan from "morgan";
import multer from "multer";
// import logger from "./utils/logger.js";
// import pino, { destination } from "pino";
const dirname = fileURLToPath(new URL(".", import.meta.url));
const dbPath = join(dirname, "db");
const uploadPath = join(dirname, "uploads");
// import corsMiddleWare from "./utils/cors-middleware.js";

const corsOptions = {
  origin: ["http://localhost:5173"],
};
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// export async function testPath() {
//   const imagePath = join(dirname, "../uploads/available packages.png");
//   const imageBuffer = fs.readFileSync(imagePath);
//   console.log("image", imageBuffer);
//   return imageBuffer;
// }

const uploads = multer({ storage });

app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ limit: "100mb", extended: true }));
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

// app.get("/", (req, res) => {
//   res.status(200).send("You are connected to the backend");
//   logger.trace("this is a test");
// });

app.all("/", function (req, res, next) {
  (res.header("Access-Control-Allow-Origin", "*"),
    res.header("ACcess-Control-Allow-Headers", "X-Requested-Width"),
    next());
});

app.use("/oracle", oracleRouter);
app.use("/api", apiRouter);
app.use("/propagate", propagateRouter);

app.get("/", (req, res) => {
  const uploadsDirectory = uploadPath;
  fs.readdir(uploadsDirectory, (err, files) => {
    if (err) {
      return res.json({ msg: err });
    }
    if (files.length === 0) {
      return res.json({ msg: "No images uploaded!" });
    }

    return res.json({ files });
  });
});

app.post("/", uploads.single("image"), async (req, res) => {
  const image = req.file.path;
  const trimmedPath = image.split("/")[1];
  res.json(trimmedPath);
});
