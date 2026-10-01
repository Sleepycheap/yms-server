import express from "express";
import {
  pickedContainers,
  unpickedContainers,
  assignContainers,
} from "../controllers/containerController.js";

const containerRouter = express.Router();

containerRouter.get("/picked/:order_number", pickedContainers);
containerRouter.get("/unpicked/:order_number", unpickedContainers);
containerRouter.post("/assign", assignContainers);

export default containerRouter;
