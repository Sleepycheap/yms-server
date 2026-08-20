import express from "express";
import {
  getAllTrucks,
  getOrgCodes,
  getProductTypes,
  getScacCodes,
  getTruckList,
} from "../db/handler.js";

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
  let array = [];
  try {
    const list = await getTruckList(org_code);
    for (let i = 0; i < list.length; i++) {
      array.push(list[i].TruckID);
    }
    res.json(array);
  } catch (err) {
    res.json(err.message);
  }
});

apiRouter.get("/alltrucks", async (req, res) => {
  try {
    const trucks = await getAllTrucks();
    res.json(trucks);
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

apiRouter.get("/scaccodes", async (req, res) => {
  try {
    const codes = await getScacCodes();
    res.json(codes);
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
