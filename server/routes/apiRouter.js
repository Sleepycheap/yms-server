import express from "express";
import {
  getAllTrucks,
  getOrgCodes,
  getProductTypes,
  getScacCodes,
  getTruckList,
  getContainersByOrder,
  getOrderDetailsUnpicked,
  getOrderDetailsLoaded,
  getOrderDetailsPicked,
  getOrderDetailsAll,
  getContNameByDescription,
  getDescriptionByContName,
  getContainerByID,
} from "../db/handler.js";
import {
  getLoadedTruckWeight,
  updateTruckID,
  verifyContainer,
  getUserID,
  getOperatingUnitID,
  validateOrder,
  getAllContainersForOrder,
  getUnpickedContainersForOrder,
  getTruckImage,
  uploadTruckImage,
} from "../oracle/functions.js";
import { getText } from "../utils/tesseractOcr.js";
import { getCustomerName } from "../oracle/functions.js";

const apiRouter = express.Router();

class ApiError extends Error {
  constructor(message, data = {}) {
    super(message);
    this.code = data.code;
    this.statusCode = data.statusCode || 500;
    this.details = data.details || null;
  }
}

// tests connection to SQLite DB
apiRouter.get("/", (req, res) => {
  res.status(200).json({ status: "connected to DB" });
});

// returns userID using UPN (email address)
apiRouter.get("/userID/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const result = await getUserID(username);
    const { USER_ID } = result[0];
    res.json(USER_ID);
  } catch (err) {
    res
      .status(400)
      .json({ "there was an error getting username": err.message });
  }
});

// get truck image by user
apiRouter.get("/truckPhoto/:userid", async (req, res) => {
  const { userid } = req.params;
  try {
    const result = await getTruckImage(userid);
    const { TRUCK_IMAGE } = result[0];
    const data = result[0];
    res.json({ TRUCK_IMAGE, data: data });
  } catch (err) {
    res.json(err.message);
  }
});

// upload truck image
apiRouter.post("/truckPhoto", async (req, res) => {
  const { truck_id, user_id, truck_image } = req.body;
  const data = req.body;
  try {
    const result = await uploadTruckImage(data);
    console.log("result", result);
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
});

// get picked/loaded containers from oracle
apiRouter.get("/containers/all/:order_number", async (req, res) => {
  const { order_number } = req.params;
  try {
    const result = await getAllContainersForOrder(order_number);
    res.json(result);
  } catch (err) {
    res
      .status(400)
      .json({ "there was an error getting containers": err.message });
  }
});

// get unpicked containers from oracle
apiRouter.get("/containers/unpicked/:order_number", async (req, res) => {
  const { order_number } = req.params;
  try {
    const result = await getUnpickedContainersForOrder(order_number);
    res.json(result);
  } catch (err) {
    res
      .status(400)
      .json({ "there was an error getting unpicked containers": err.message });
  }
});

// Gets all orgcodes from local DB
apiRouter.get("/orgcodes", async (req, res) => {
  try {
    const codes = await getOrgCodes();
    res.json(codes);
  } catch (err) {
    res
      .status(400)
      .json({ "There was an error getting org codes": err.message });
  }
});

// returns customer name on order
apiRouter.get("/customer/:order_number", async (req, res) => {
  const { order_number } = req.params;
  try {
    const result = await getCustomerName(order_number);
    const data = result[0];
    const { CUSTOMER_NAME } = data;
    res.json(CUSTOMER_NAME);
  } catch (err) {
    res
      .status(400)
      .json({ "there was an error getting customer info": err.message });
  }
});

// Gets all containers from sqlite for specific order number
apiRouter.get("/containers/:order_no", async (req, res) => {
  const { order_no } = req.params;
  try {
    const containers = await getContainersByOrder(order_no);
    res.json(containers);
  } catch (err) {
    res
      .status(400)
      .json({ "there was an error getting containers": err.message });
  }
});

apiRouter.get("/container/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  try {
    const container = await getContainerByID(id);
    console.log("container", container);
    res.json(container);
  } catch (err) {
    res
      .status(400)
      .json({ "there was an error getting container": err.message });
  }
});

// get containers from local by description
apiRouter.get("/contname/:item_description", async (req, res) => {
  const { item_description } = req.params;
  try {
    const cont_name = await getContNameByDescription(item_description);
    res.json(cont_name);
  } catch (err) {
    res.json({ "there was an error getting container name": err.message });
  }
});

apiRouter.get("/description/:cont_name", async (req, res) => {
  const { cont_name } = req.params;
  try {
    const item_description = await getDescriptionByContName(cont_name);
    res.json(item_description);
  } catch (err) {
    res.json({ "there was an error getting container name": err.message });
  }
});

// gets order details for specific order number
// order details is an aggregated list, with one aggregated row for EACH container_name
apiRouter.get("/details/all/:order_no", async (req, res) => {
  const { order_no } = req.params;
  try {
    const details = await getOrderDetailsAll(order_no);
    res.json(details);
  } catch (err) {
    res
      .status(400)
      .json({ "there was an error getting order details": err.message });
  }
});

//get containers by pick status
apiRouter.get("/details/:order_no", async (req, res) => {
  const { order_no } = req.params;
  const { filter } = req.query;
  try {
    if (filter === "loaded") {
      const details = await getOrderDetailsLoaded(order_no);
      res.json(details);
    } else if (filter === "picked") {
      const details = await getOrderDetailsPicked(order_no);
      res.json(details);
    } else if (filter === "unpicked") {
      const details = await getOrderDetailsUnpicked(order_no);
      res.json(details);
    }
  } catch (err) {
    res
      .status(400)
      .json({ "there was an error getting order details": err.message });
  }
});

// // gets order details for containers that have been assigned a truck id
// apiRouter.get("/loaded/:order_no", async (req, res) => {
//   const { order_no } = req.params;
//   try {
//     const details = await getOrderDetailsLoaded(order_no);
//     res.json(details);
//   } catch (err) {
//     res.json({ "there was an error getting order details": err.message });
//   }
// });

// apiRouter.get("/test/:order", async (req, res) => {
//   const { order } = req.params;
//   try {
//     const details = await getOrderDetailsLoaded(order);
//     res.json(details);
//   } catch (err) {
//     res.json({ "there was an error getting order details": err.message });
//   }
// });

// gets order details for containers that have been assigned a truck id
// apiRouter.get("/details/unpicked/:order_no", async (req, res) => {
//   const { order_no, unpicked } = req.params;
//   try {
//     const details = await getOrderDetailsUnpicked(order_no);
//     res.json(details);
//   } catch (err) {
//     res.json({ "there was an error getting order details": err.message });
//   }
// });

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
    res
      .status(400)
      .json({ "There was an error getting trucks for this org": err.message });
  }
});

// gets ALL truckIDs
apiRouter.get("/alltrucks", async (req, res) => {
  try {
    const trucks = await getAllTrucks();
    res.json(trucks);
  } catch (err) {
    res
      .status(400)
      .json({ "There was an error getting all truck IDs": err.message });
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

// gets scac codes
apiRouter.get("/scaccodes", async (req, res) => {
  try {
    const codes = await getScacCodes();
    res.json(codes);
  } catch (err) {
    res
      .status(400)
      .json({ "There was an error getting scac codes": err.message });
  }
});

// gets weight and cont qty of truck
apiRouter.get("/getweight/:truckid", async (req, res) => {
  const { truckid } = req.params;
  try {
    const weight = await getLoadedTruckWeight(truckid);
    res.json(weight);
  } catch (err) {
    res
      .status(400)
      .json({ "There was an error getting Truck weight/qty": err.message });
  }
});

// verifies if order number belongs to this org
apiRouter.get("/verifyOrder/:orgCode/:orderNumber", async (req, res) => {
  const { orgCode, orderNumber } = req.params;
  try {
    const result = await validateOrder(orgCode, orderNumber);
    if (result.length === 0) {
      res.json({
        "This Order does not belong to this Organization": result,
        order_verified: false,
      });
    } else {
      return res.json({
        "This is a valid order in this organization": result,
        order_verified: true,
      });
    }
  } catch (err) {
    res.status(400).json({
      "There was an eror verifying Order": err.message,
    });
  }
});

// verifies if container on is on order or not
apiRouter.get("/verifyContainer/:orderNumber/:cont", async (req, res) => {
  const { orderNumber, cont } = req.params;
  try {
    const result = await verifyContainer(orderNumber, cont);
    if (result.length === 0) {
      return res.json({ "This container is not on this order": result });
    } else {
      return res.json({ "This container is valid": result });
    }
  } catch (err) {
    res
      .status(400)
      .json({ "There was an error verifying Container": err.message });
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

// assigns or removes truckID.
// Assign_type determines whether truck is added or removed. A = 'assign', R = 'remove'
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
    // console.log(cont_name);
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
    const { status } = result;
    if (status !== "S") throw new Error(status);
    res.json(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export default apiRouter;
