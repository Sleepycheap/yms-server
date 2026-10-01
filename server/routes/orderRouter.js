import express from "express";
import {
  getCustomer,
  getAllDetails,
  getContDetails,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/customer/:ordernumber", getCustomer);
orderRouter.get("/details/:ordernumber/all", getAllDetails);
orderRouter.get("/details/:ordernumber", getContDetails);

export default orderRouter;
