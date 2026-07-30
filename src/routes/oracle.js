import express from "express";
import { getTable, testConnection } from "../../db/queries.js";

const oracleRouter = express.Router();

oracleRouter.get("/", async (req, res) => {
  const response = await testConnection();
  res.json(response);
  // console.log("response", response);
});

oracleRouter.get("/:table", async (req, res) => {
  try {
    const table = req.params.table;
    const response = await getTable(table);
    console.log("tables:", response);
    // response.rows.forEach((row) => {
    //   console.log(row[0]);
    // });
    res.json({ tables: response });
  } catch (err) {
    res.json("ERROR", err);
    console.log("ERROR", err);
  }
});

export default oracleRouter;
