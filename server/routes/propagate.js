import express from "express";
// import { GetOrgCode } from "../oracle/procedures";
import { PopulateOrgCode } from "../oracle/oracleQueries.js";
import {
  getAllContainersForOrder,
  getTruckID,
  getUnpickedContainersForOrder,
} from "../oracle/functions.js";
import { db } from "../db/database.js";
import { getContainersByOrder, insertIntoTable } from "../db/handler.js";
import logger from "../utils/logger.js";

const propagateRouter = express.Router();

// this router will be used to propagate local sqlite tables with oracle data
propagateRouter.post("/orgcodes", async (req, res) => {
  try {
    const result = await PopulateOrgCode();
    res.json("successfully inserted orgcodes into local table");
  } catch (err) {
    res.json({ "there was an error populating org cods": err.message });
  }
});

propagateRouter.post("/truckids", async (req, res) => {
  const { org_code } = req.body;
  try {
    const del = db.prepare(`DELETE FROM Trucks`);
    del.run();
    const list = await getTruckID(org_code);
    for (let i = 0; i < list.length; i++) {
      const { TRUCK_ID } = list[i];
      insertIntoTable("Trucks", `('${TRUCK_ID}')`);
    }
    // console.log("result", result);
    res.json("successfully inserted truckids into local table");
  } catch (err) {
    res.json({ "there was an error getting truckids": err.message });
  }
});

propagateRouter.post("/containers", async (req, res) => {
  const { order_number } = req.body;
  let containers = [];
  try {
    const del = db.prepare("DELETE FROM Containers");
    del.run();
    const list = await getAllContainersForOrder(order_number);
    const unpicked = await getUnpickedContainersForOrder(order_number);

    for (let i = 0; i < list.length; i++) {
      const { ORDER_NO } = list[i];
      const { CONT_NAME } = list[i];
      const { CONT_QTY } = list[i];
      const { CONT_GROSS_WT } = list[i];
      const { SHIP_FROM_ORG_CODE } = list[i];
      const { TRUCK_ID_2 } = list[i];
      const { SHIP_SET_NAME } = list[i];
      const { ITEM_DESCRIPTION } = list[i];

      const result = db.prepare(
        `INSERT INTO Containers (order_number, cont_name, cont_qty, cont_gross_wt, ship_from_org_code, direct_truck, ship_set_name, item_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      );
      result.run(
        ORDER_NO,
        CONT_NAME,
        CONT_QTY,
        CONT_GROSS_WT,
        SHIP_FROM_ORG_CODE,
        TRUCK_ID_2,
        SHIP_SET_NAME,
        ITEM_DESCRIPTION,
      );
    }

    for (let i = 0; i < unpicked.length; i++) {
      const { ORDER_NUMBER } = unpicked[i];
      const { CONT_NAME } = unpicked[i];
      const CONT_QTY = null;
      const CONT_GROSS_WT = null;
      const { SHIPPING_ORG } = unpicked[i];
      const TRUCK_ID_2 = null;
      const SHIP_SET_NAME = null;
      const { ITEM_DESCRIPTION } = unpicked[i];
      const result = db.prepare(
        `INSERT INTO Containers (order_number, cont_name, cont_qty, cont_gross_wt, ship_from_org_code, direct_truck, ship_set_name, item_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      );
      result.run(
        ORDER_NUMBER,
        CONT_NAME,
        CONT_QTY,
        CONT_GROSS_WT,
        SHIPPING_ORG,
        TRUCK_ID_2,
        SHIPPING_ORG,
        ITEM_DESCRIPTION,
      );
    }

    const containers = await getContainersByOrder(order_number);
    res.json(containers);
  } catch (err) {
    // console.log("containers", containers);
    // logger.trace();
    res.status(400).json(err.message);
    // console.log("err", err.message);
  }
});

export default propagateRouter;
