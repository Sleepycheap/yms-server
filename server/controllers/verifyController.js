import {
  updateTruckID,
  validateOrder,
  verifyContainer,
} from "../oracle/functions.js";

export async function orderValidation(req, res) {
  const { orgCode, orderNumber } = req.body;
  try {
    const result = await validateOrder(orgCode, orderNumber);
    if (!result.orderValid) {
      res.json({
        "This order does not belong to this organization": result,
        order_verified: false,
      });
    } else {
      return res.json({
        "This is a valid order in this organization": result,
        order_verified: true,
      });
    }
  } catch (err) {
    res.status(500).json({ "There was an error verifying order": err.message });
  }
}

export async function containerValidation(req, res) {
  const { orderNumber, cont } = req.body;
  try {
    const result = await verifyContainer(orderNumber, cont);
    if (result.length === 0) {
      return res.json({ "This container is not on this order": result });
    } else {
      return res.json({ "This container is valid": result });
    }
  } catch (err) {
    res
      .status(500)
      .json({ "There was an error verifying container": err.message });
  }
}
