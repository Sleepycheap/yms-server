import express from "express";
import { getAllItems, getItemsByTruckID, addItem } from "../../db/queries.js";

const itemRouter = express.Router();

itemRouter.get("/", async (req, res) => {
  const response = await getAllItems();
  if (response.length === 0) res.json("There are no Items!");
  res.json(response);
});

itemRouter.get("/:truckid", async (req, res) => {
  const truckid = req.params.truckid;
  const response = await getItemsByTruckID(truckid);
  if (response.length === 0) res.json("There are no Items with that Truck ID!");
  res.json(response);
});

itemRouter.post("/", async (req, res) => {
  const {
    container,
    description,
    gross_qty,
    gross_wgt,
    shipping_ins,
    truckid,
  } = req.body;

  const newItem = {
    container,
    description,
    gross_qty,
    gross_wgt,
    shipping_ins,
    truckid,
  };

  try {
    await addItem(newItem);
    res.json({ newItem: newItem }).status(201);
  } catch (err) {
    console.log("there was an error", err.message);
    const msg = err.message;
    res.json({ "there was an error": msg }).status(400);
  }
});

export default itemRouter;
