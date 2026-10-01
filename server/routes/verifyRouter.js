import express from "express";
import {
  orderValidation,
  containerValidation,
} from "../controllers/verifyController.js";

const verifyRouter = express.Router();

verifyRouter.post("/verifyOrder", orderValidation);
verifyRouter.post("/verifyContainer", containerValidation);

export default verifyRouter;
