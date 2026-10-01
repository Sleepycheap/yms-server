import express from "express";
import { getTruckImage } from "../oracle/functions.js";
import {
  getImages,
  getTrucksByOrg,
  uploadImages,
  allTrucks,
  getTruckWeight,
} from "../controllers/truckController.js";

const truckRouter = express.Router();

truckRouter.get("/photos/:userid/:truckid", getImages);
truckRouter.get("/", getTrucksByOrg);
truckRouter.get("/all", allTrucks);
truckRouter.get("/weight/:truckid", getTruckWeight);

truckRouter.post("/photos", uploadImages);
export default truckRouter;
