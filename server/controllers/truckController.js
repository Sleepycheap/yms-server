import axios from "axios";
import {
  getLoadedTruckWeight,
  getTruckImage,
  uploadTruckImage,
} from "../oracle/functions.js";
import { getAllTrucks, getTruckList } from "../db/handler.js";

class ApiError extends Error {
  constructor(message, data = {}) {
    super(message);
    this.code = data.code;
    this.statusCode = data.statusCode || 500;
    this.details = data.details || null;
  }
}

// get truck images by userid
export const getImages = async (req, res) => {
  const { userid, truckid } = req.params;
  try {
    const result = await getTruckImage(userid, truckid);
    res.json(result);
  } catch (err) {
    res.json(err.message);
  }
};

export const uploadImages = async (req, res) => {
  const data = req.body;
  try {
    const result = await uploadTruckImage(data);
    if (result.errorName)
      throw new ApiError("Error uploading truck photo", {
        code: result.errorName,
        statusCode: 422,
        details: result.errorMsg,
      });
    res.json(result);
  } catch (err) {
    res.status(422).json(err);
  }
};

// get trucks by org
export const getTrucksByOrg = async (req, res) => {
  const { org_code } = req.query;
  let array = [];
  try {
    const list = await getTruckList(org_code);
    console.log(list);
    for (let i = 0; i < list.length; i++) {
      array.push(list[i].TruckID);
    }
    res.json(array);
  } catch (err) {
    res
      .status(404)
      .json({ "there wasd an error getting trucks for this org": err.message });
  }
};

export const allTrucks = async (req, res) => {
  try {
    const result = await getAllTrucks();
    res.json(result);
  } catch (err) {
    res
      .status(404)
      .json({ "there was an error getting all Truck IDs": err.message });
  }
};

export const getTruckWeight = async (req, res) => {
  const { truckid } = req.params;
  try {
    const result = await getLoadedTruckWeight(truckid);
    res.json(result);
  } catch (err) {
    res
      .status(404)
      .json({ "there was an error getting truck weight/qty": err.message });
  }
};
