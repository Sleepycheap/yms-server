import express from "express";
import { getUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/:upn", getUser);

export default userRouter;
