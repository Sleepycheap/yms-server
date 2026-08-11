import express from "express";
import { json } from "body-parser";
import {
  getScacList,
  getTruckList,
  gotoTruckSelection,
  populateOrg,
  truckSelectionTest,
  getOrgCode,
} from "../controllers/TruckSelection.js";

const truckSelectionRouter = express.Router();

truckSelectionRouter.get("/:orgCode", gotoTruckSelection);

truckSelectionRouter.get("/truck/:orgCode", getTruckList);
truckSelectionRouter.get("/scacList", getScacList);
truckSelectionRouter.get("/orgCodes", getOrgCode);

export default truckSelectionRouter;
