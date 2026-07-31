import express from "express";
import {
  getObjectById,
  getAllOrders,
  getOrderByOrderNumber,
  addOrder,
  deleteOrder,
} from "../../db/queries.js";
import axios from "axios";

const orderRouter = express.Router();

orderRouter.get("/", async (req, res) => {
  const response = await getAllOrders();
  if (response.length === 0) res.json("Orders table is empty");
  res.json(response);
});

orderRouter.get("/:order_number", async (req, res) => {
  const { order_number } = req.params;
  const response = await getOrderByOrderNumber(order_number);
  res.json(response);
});

orderRouter.post("/", async (req, res) => {
  const { order_number, customer } = req.body;

  // const data = req.body;

  const newOrder = {
    order_number,
    customer,
  };

  try {
    await addOrder(newOrder);
    res.json({ newOrder: newOrder }).status(201);
  } catch (err) {
    console.log("there was an error", err.message);
    const msg = err.message;
    res.json({ "there was an error": msg }).status(400);
  }
});

orderRouter.delete("/:order_number", async (req, res) => {
  const { order_number } = req.params;
  try {
    const response = await deleteOrder(order_number);
    const sMsg = `Order ${order_number} successfully deleted!`;
    res.json(sMsg).status(200);
  } catch (err) {
    console.log("There was an error deleting item", err.message);
    res.json({ "There was an error": err.message }).status(400);
  }
});

export default orderRouter;
