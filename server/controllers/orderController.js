import {
  getOrderDetailsAll,
  getOrderDetailsLoaded,
  getOrderDetailsPicked,
  getOrderDetailsUnpicked,
} from "../db/handler.js";
import { getCustomerName } from "../oracle/functions.js";

export async function getCustomer(req, res) {
  const { ordernumber } = req.params;
  try {
    const result = await getCustomerName(ordernumber);
    const data = result[0];
    const { CUSTOMER_NAME } = data;
    res.json(CUSTOMER_NAME);
  } catch (err) {
    res
      .status(404)
      .json({ "there was an error getting customer info": err.message });
  }
}

export async function getAllDetails(req, res) {
  const { ordernumber } = req.params;
  try {
    const details = await getOrderDetailsAll(ordernumber);
    res.json(details);
  } catch (err) {
    res.status(404).json({
      "there was an error getting details": err.message,
    });
  }
}

export async function getContDetails(req, res) {
  const { ordernumber } = req.params;
  const { filter } = req.query;
  try {
    if (filter === "loaded") {
      const details = await getOrderDetailsLoaded(ordernumber);
      res.json(details);
    } else if (filter === "picked") {
      const details = await getOrderDetailsPicked(ordernumber);
      res.json(details);
    } else if (filter === "unpicked") {
      const details = await getOrderDetailsUnpicked(ordernumber);
      res.json(details);
    }
  } catch (err) {
    res
      .status(404)
      .json({ "there was an error getting order details": err.message });
  }
}
