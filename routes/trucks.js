import express from "express";
import {
  getTruck,
  getTruckByID,
  getTrucksByOrg,
  addTruck,
  deleteTruck,
} from "../../db/queries.js";
import { json } from "body-parser";
const truckRouter = express.Router();

truckRouter.get("/", async (req, res) => {
  try {
    const response = await getTruck();
    if (response.length === 0) res.json("The truck table is empty");
    res.json(response);
  } catch (err) {
    console.log("there was an error", err);
    res.json({ "there was an error": err.message }).status(400);
  }
});

truckRouter.get("/id", async (req, res) => {
  const { id } = req.query;
  try {
    const response = await getTruckByID(id);
    console.log(response);
    if (response.length === 0) res.json("Cannot find truck with this ID!");
    res.json(response);
  } catch (err) {
    console.log("There was an error", err);
    res.json({ "there was an error": err.message }).status(400);
  }
});

truckRouter.get("/org", async (req, res) => {
  const { org } = req.query;
  try {
    const response = await getTrucksByOrg(org);
    if (response.length === 0) res.json("Cannot find truck under this Org");
    res.json(response);
  } catch (err) {
    console.log("There was an error", err);
    res.json({ "there was an error": err.message });
  }
});

truckRouter.post("/", async (req, res) => {
  const { truck_id, org_code } = req.body;

  const newTruck = {
    truck_id,
    org_code,
  };

  try {
    await addTruck(newTruck);
    res.json({ "New Truck Created": newTruck }).status(201);
  } catch (err) {
    console.log("there was an error", err.message);
    res.json({ "There was an error": err.message });
  }
});

truckRouter.delete("/:truck_id", async (req, res) => {
  const { truck_id } = req.params;
  try {
    const response = await deleteTruck(truck_id);
    // console.log(response);
    const sMsg = `Truck ${truck_id} successfully deleted!`;
    res.json(sMsg).status(200);
  } catch (err) {
    console.log("there was an error deleting truck", err.message);
    res.json({ "There was an error": err.message }).status(400);
  }
});

export default truckRouter;
