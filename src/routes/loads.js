import express from "express";
import { getAllLoads, addLoad, getLoadsByTruckID } from "../../db/queries.js";

const loadRouter = express.Router();

loadRouter.get("/", async (req, res) => {
  const response = await getAllLoads();
  // console.log(response);
  // const data = response.json;
  if (response.length === 0) res.json("Loads table is empty");
  res.json(response);
});

loadRouter.get("/:truckid", async (req, res) => {
  const truckid = req.params.truckid;
  const response = await getLoadsByTruckID(truckid);
  if (response.length === 0) res.json("There is no load with this Truck ID");
  res.json(response);
});

loadRouter.post("/", async (req, res) => {
  const { truckid, orderid, plant, total_weight, total_qty } = req.body;

  const newLoad = {
    truckid,
    orderid,
    plant,
    total_weight,
    total_qty,
  };

  try {
    await addLoad(newLoad);
    res.json({ "New Load": newLoad }).status(201);
  } catch (err) {
    console.log("there was an error", err);
    res.json("there was an error", err).status(400);
  }
});

export default loadRouter;
