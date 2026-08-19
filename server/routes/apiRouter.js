import express from "express";
import { getOrgCodes, getProductTypes, getTruckList } from "../db/handler.js";

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.status(200).json({ status: "connected to DB" });
});

apiRouter.get("/orgcodes", async (req, res) => {
  try {
    const codes = await getOrgCodes();
    res.json(codes);
  } catch (err) {
    res.json(err.message);
  }
});

apiRouter.get("/trucks", async (req, res) => {
  const { org_code } = req.query;
  try {
    const list = await getTruckList(org_code);
    res.json(list);
  } catch (err) {
    res.json(err.message);
  }
});

apiRouter.get("/producttypes", async (req, res) => {
  try {
    const table = await getProductTypes();
    res.json(table);
  } catch (err) {
    return err.message;
  }
});

// apiRouter.delete('/:table_name', async (req, res) => {
//   try {
//     const {table_name} = req.params

//   }
// })

export default apiRouter;
