import { getUserID } from "../oracle/functions.js";

export async function getUser(req, res) {
  const { username } = req.params;
  try {
    const result = await getUserID(username);
    const { USER_ID } = result[0];
    res.json(USER_ID);
  } catch (err) {
    res
      .status(404)
      .json({ "there was an error getting username": err.message });
  }
}
