import express from "express";
import { getCarriers, addCarriers } from "../../db/queries.js";

const carrierRouter = express.Router();

carrierRouter.get("/", async (req, res) => {
  const response = await getCarriers();
  if (response.length === 0) res.json("carriers table is empty");
  res.json(response);
});

carrierRouter.post("/", async (req, res) => {
  const { scac_code, name } = req.body;

  const newCarrier = {
    scac_code,
    name,
  };

  try {
    await addCarriers(newCarrier);
    res.json({ "New Carrier": newCarrier }).status(201);
  } catch (err) {
    console.log("there was an error", err);
    res.json("there was an error", err).status(400);
  }
});

export default carrierRouter;
