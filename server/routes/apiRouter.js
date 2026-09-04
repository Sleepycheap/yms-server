import express from "express";
import {
  getAllTrucks,
  getOrgCodes,
  getProductTypes,
  getScacCodes,
  getTruckList,
  getContainersByOrder,
  getOrderDetails,
  getOrderDetailsNoTruck,
  getOrderDetailsWTruck,
} from "../db/handler.js";
import { getLoadedTruckWeight, updateTruckID } from "../oracle/functions.js";
import { getText } from "../utils/tesseractOcr.js";
import { getCustomerName } from "../oracle/functions.js";

const apiRouter = express.Router();

// tests connection to SQLite DB
apiRouter.get("/", (req, res) => {
  res.status(200).json({ status: "connected to DB" });
});

// Gets all orgcodes from local DB
apiRouter.get("/orgcodes", async (req, res) => {
  try {
    const codes = await getOrgCodes();
    res.json(codes);
  } catch (err) {
    res.json(err.message);
  }
});

apiRouter.get("/customer/:order_number", async (req, res) => {
  const { order_number } = req.params;
  try {
    const result = await getCustomerName(order_number);
    const data = result[0];
    const { CUSTOMER_NAME } = data;
    // console.log(data);
    // const { CUSTOMER_NAME } = result;
    res.json(CUSTOMER_NAME);
  } catch (err) {
    res.json({ "there was an error getting customer info": err.message });
  }
});

// Gets all containers for specific order number
apiRouter.get("/containers/:order_no", async (req, res) => {
  const { order_no } = req.params;
  try {
    const containers = await getContainersByOrder(order_no);
    res.json(containers);
  } catch (err) {
    res.json({ "there was an error getting containers": err.message });
  }
});

// gets order details for specific order number
// order details is an aggregated list, with one aggregated row for EACH container_name
apiRouter.get("/details/:order_no", async (req, res) => {
  const { order_no } = req.params;
  try {
    const details = await getOrderDetails(order_no);
    res.json(details);
  } catch (err) {
    res.json({ "there was an error getting order details": err.message });
  }
});

// gets order details for containers that have not been assigned a truck id
apiRouter.get("/details/:order_no/notloaded", async (req, res) => {
  const { order_no } = req.params;
  try {
    const details = await getOrderDetailsNoTruck(order_no);
    res.json(details);
  } catch (err) {
    res.json({ "there was an error getting order details": err.message });
  }
});

// gets order details for containers that have been assigned a truck id
apiRouter.get("/details/:order_no/loaded", async (req, res) => {
  const { order_no } = req.params;
  try {
    const details = await getOrderDetailsWTruck(order_no);
    res.json(details);
  } catch (err) {
    res.json({ "there was an error getting order details": err.message });
  }
});

// gets all truckIDs for requested org
apiRouter.get("/trucks", async (req, res) => {
  const { org_code } = req.query;
  let array = [];
  try {
    const list = await getTruckList(org_code);
    for (let i = 0; i < list.length; i++) {
      array.push(list[i].TruckID);
    }
    res.json(array);
  } catch (err) {
    res.json(err.message);
  }
});

// gets ALL truckIDs
apiRouter.get("/alltrucks", async (req, res) => {
  try {
    const trucks = await getAllTrucks();
    res.json(trucks);
  } catch (err) {
    res.json(err.message);
  }
});

apiRouter.get("/producttypes", async (req, res) => {
  try {
    const table = await getProductTypes();
    res.json(table);
  } catch (err) {
    return err.message;
  }
});

apiRouter.get("/scaccodes", async (req, res) => {
  try {
    const codes = await getScacCodes();
    res.json(codes);
  } catch (err) {
    return err.message;
  }
});

apiRouter.get("/getweight/:orgcode/:truckid", async (req, res) => {
  const { orgcode, truckid } = req.params;
  try {
    const weight = await getLoadedTruckWeight(orgcode, truckid);
    res.json(weight);
  } catch (err) {
    return err.message;
  }
});

apiRouter.post("/extractText", async (req, res) => {
  const { imageSrc } = req.body;
  try {
    const text = await getText(imageSrc);
    res.json(text);
  } catch (err) {
    return err.message;
  }
});

apiRouter.post("/containers/assign", async (req, res) => {
  const {
    order_number,
    cont_name,
    ship_from_org_code,
    org,
    ship_set_name,
    truck_id,
    assign_type,
    user_id,
    header_truck,
    truck_flag,
  } = req.body;

  try {
    const result = await updateTruckID(
      order_number,
      cont_name,
      ship_from_org_code,
      org,
      ship_set_name,
      truck_id,
      assign_type,
      user_id,
      header_truck,
      truck_flag,
    );
    res.json(result);
  } catch (err) {
    return err.message;
  }
});

export default apiRouter;
