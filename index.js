import express from "express";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
// import { getAllOrders, getCarriers} from "./db/queries.js";
import orderRouter from "./src/routes/orders.js";
import carrierRouter from "./src/routes/carrier.js";
import loadRouter from "./src/routes/loads.js";
import itemRouter from "./src/routes/items.js";
import bodyParser from "body-parser";
import cors from "cors";

const dirname = fileURLToPath(new URL(".", import.meta.url));
const dbPath = join(dirname, "db");
// const bodyParser = bodyParser.json();
const app = express();

app.use(cors());
app.use(express.static(dbPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const port = 8080;

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log("YMS Server running on port", port);
});

app.get("/", (req, res) => {
  res.json("you are connected to YMS server");
});
app.use("/orders", orderRouter);
app.use("/carriers", carrierRouter);
app.use("/loads", loadRouter);
app.use("/items", itemRouter);
