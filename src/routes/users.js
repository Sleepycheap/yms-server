import express from "express";
import {
  getAllUsers,
  getUserByName,
  addUser,
  deleteUser,
} from "../../db/queries.js";
import { json } from "body-parser";

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    const response = await getAllUsers();
    if (response.length === 0) res.json("There are no users!");
    res.json(response);
  } catch (err) {
    console.log("there was an error", err);
    res.json({ "there was an error": err.message }).status(400);
  }
});

// Not currently used. Proof of concept
userRouter.get("/:fullname", async (req, res) => {
  const { fullname } = req.params;
  const qName = fullname.split(".");
  const first_name = qName[0];
  const last_name = qName[1];
  const user = { first_name: first_name, last_name: last_name };
});

userRouter.get("/:first_name", async (req, res) => {
  const { first_name } = req.params;
  try {
    const response = await getUserByName(first_name);
    if (response.length === 0) res.json("There is no user with that name!");
    json.response(response);
  } catch (err) {
    console.log("There was an error", err);
    res.json({ "There was an error": err.message }).sendStatus(400);
  }
});

userRouter.post("/", async (req, res) => {
  const { first_name, last_name, plant } = req.body;

  const newUser = {
    first_name,
    last_name,
    plant,
  };
  console.log(newUser);
  try {
    await addUser(newUser);
    res.json({ "new user created": newUser });
  } catch (err) {
    console.log("there was an error", err.message);
    res.json({ "there was an error": err.message }).status(400);
  }
});

userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteUser(id);
    // const sMsg = `User successfully deleted!`;
    res.json("User successfully deleted").status(200);
  } catch (err) {
    console.log("There was an error deleting user", err.message);
    res.json({ "there was an error": err.message }).status(400);
  }
});

export default userRouter;
