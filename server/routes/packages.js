import express from "express";
import {
  getAllPackages,
  addPackage,
  getAllPackageDetails,
  getPackageDetailsByOrderNumber,
  getPackageDetailsByPackageName,
  deletePackage,
} from "../db/queries.js";

const packageRouter = express.Router();

packageRouter.get("/", async (req, res) => {
  const response = await getAllPackages();
  // console.log(response);
  // const data = response.json;
  if (response.length === 0) res.json("Loads table is empty");
  res.json(response);
});

packageRouter.get("/order/:order_number", async (req, res) => {
  const { order_number } = req.params;
  try {
    const response = await getPackageDetailsByOrderNumber(order_number);
    if (response.length === 0)
      res.json("There is no pacakge with this Order Number!");
    res.json(response);
  } catch (err) {
    res.json(err.message);
  }
});

packageRouter.get("/name/:package_name", async (req, res) => {
  const { package_name } = req.params;
  console.log(package_name);
  try {
    const response = await getPackageDetailsByPackageName(package_name);
    console.log(response);
    if (response.length === 0) res.json("There is no package with this Name!");
    res.json(response);
  } catch (err) {
    res.json(err.message);
  }
});

packageRouter.post("/", async (req, res) => {
  const { package_name, order_number, status } = req.body;

  const newPackage = {
    package_name,
    order_number,
    status,
  };
  console.log(newPackage);

  try {
    await addPackage(newPackage);
    res.json({ "New Package": newPackage }).status(201);
  } catch (err) {
    console.log("there was an error", err);
    res.status(400).json("there was an error", err);
  }
});

packageRouter.delete("/:order_number/:package_name", async (req, res) => {
  const { order_number } = req.params;
  const { package_name } = req.params;
  try {
    await deletePackage(order_number, package_name);
    const sMsg = `Package ${package_name} w/ Order#:${order_number} has been successfully deleted!`;
    res.json(sMsg).status(200);
  } catch (err) {}
  res.json({ "There was an error": err.message }).status(200);
});

export default packageRouter;
