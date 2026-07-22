import express from "express";
import {
  getOrderByID,
  getObjectById,
  getAllOrders,
  addOrder,
} from "../../db/queries.js";
import axios from "axios";

const orderRouter = express.Router();

orderRouter.get("/", async (req, res) => {
  const response = await getAllOrders();
  if (response.length === 0) res.json("Orders table is empty");
  res.json(response);
});

orderRouter.post("/", async (req, res) => {
  const { orderid, truckid, customer } = req.body;

  // const data = req.body;

  const newOrder = {
    orderid,
    truckid,
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

orderRouter.get("/:orderid", async (req, res) => {
  const orderid = req.params.orderid;
  const response = await getOrderByID(orderid);
  res.json(response);
});

export default orderRouter;
