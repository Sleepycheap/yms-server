import express from "express";
import {
  getAllItems,
  getOneItem,
  addItem,
  deleteItem,
} from "../../db/queries.js";
import { json } from "body-parser";

const itemRouter = express.Router();

itemRouter.get("/", async (req, res) => {
  const response = await getAllItems();
  if (response.length === 0) res.json("There are no Items!");
  res.json(response);
});

itemRouter.get("/:part_number", async (req, res) => {
  const { part_number } = req.params;
  try {
    const response = await getOneItem(part_number);
    console.log(response);
    if (response.length === 0)
      res.json("There are no Items with that Truck ID!");
    res.json(response);
  } catch (err) {
    console.log("error", err);
    res.json({ "there was an error": err.message }).status(400);
  }
});

itemRouter.post("/", async (req, res) => {
  const { part_number, description, part_mark } = req.body;

  const newItem = {
    part_number,
    description,
    part_mark,
  };

  try {
    await addItem(newItem);
    res.json({ newItem: newItem }).status(201);
  } catch (err) {
    const msg = err.message;
    console.log("there was an error", err.message);
    res.json({ "there was an error": msg }).status(400);
  }
});

itemRouter.delete("/:part_number", async (req, res) => {
  const { part_number } = req.params;
  try {
    const response = await deleteItem(part_number);
    console.log(response);
    const sMsg = `Item ${part_number} successfully deleted!`;
    res.json(sMsg).status(200);
  } catch (err) {
    console.log("there was an error deleting item", err.message);
    res.json({ "There was an error": err.message }).status(400);
  }
});

export default itemRouter;
