import oracledb from "oracledb";
import { pool } from "./pool.js";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
import { insertIntoTable } from "../db/handler.js";
import { db } from "../db/database.js";
// import { dir } from "node:console";
dotenv.config({ path: "../server/.env" });

const connection = await pool.getConnection();
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsBuffer = [oracledb.BLOB];

// const packageName = "XXBBNA_WAREHOUSE_PROCESS_PKG";
const pkg = process.env.PACKAGENAME;

const userID = 122452;

// function example
// returns Org ID
export async function getOperatingUnitID(orgCode) {
  try {
    const result = await connection.execute(
      `BEGIN
      :ret := ${pkg}.xxbbna_get_operating_unit_id(:orgcode);
      END;`,
      {
        orgcode: orgCode,
        ret: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
    );
    return result.outBinds.ret;
  } catch (err) {
    console.log("error getting operating unit ID", err.message);
  }
}

export async function getTruckImage(userId) {
  try {
    const result = await connection.execute(
      `SELECT * FROM XXBBNA_TRUCK_IMAGE WHERE CREATED_BY = :id`,
      [userId],
      { fetchInfo: { TRUCK_IMAGE: { type: oracledb.BUFFER } } },
    );
    const { rows } = result;
    return rows;
  } catch (err) {
    console.log("there was an error getting truck image", err.message);
  }
}

// uploads image to truck image table
/*
const imageBuffer = fs.readFileSync(imagePath);
This creates buffer to send to oracle. 
const imageObject = {
  TRUCK_ID: "2600429001T2",
  USER_ID: 122452,
  TRUCK_IMAGE: imageBuffer,
};
await uploadTruckImage(imageObject);
*/

export async function uploadTruckImage(imageObject) {
  try {
    const { TRUCK_ID, USER_ID, TRUCK_IMAGE } = imageObject;
    const sql = `INSERT INTO XXBBNA_TRUCK_IMAGE (truck_id, truck_image, created_by, creation_date, last_update_date, last_updated_by) VALUES (:p1, :p2, :p3, SYSDATE, SYSDATE, :p3)`;
    const binds = {
      p1: TRUCK_ID,
      p2: { val: TRUCK_IMAGE, type: oracledb.BUFFER, dir: oracledb.BIND_IN },
      p3: USER_ID,
    };
    const options = { autoCommit: true };
    const result = await connection.execute(sql, binds, options);
    return result;
  } catch (err) {
    console.log("there was an error uploading truck image", err.message);
  }
}

// returns userID from oracle using email address
export async function getUserID(userPrincipalName) {
  try {
    const result = await connection.execute(
      `select * from applsys.fnd_user where email_address = :email`,
      [userPrincipalName],
    );
    const { rows } = result;
    return rows;
  } catch (err) {
    console.log("error getting user ID", err.message);
  }
}

export async function creditCheck(orderNumber, orgCode) {
  try {
    const result = await connection.execute(
      `BEGIN
        :ret := xxcustom_order_credit_check(:order_no, :org_code);
      END;`,
      {
        order_no: orderNumber,
        org_code: orgCode,
        ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      },
    );
    return result.outBinds;
  } catch (err) {
    console.log("error running credit check", err.message);
  }
}

// returns empty array if container is not listed on order
export async function verifyContainer(orderNo, cont) {
  try {
    const result = await connection.execute(
      `SELECT order_no, cont_name FROM xxwsh_containers WHERE order_no = :orderNo AND cont_name = :cont`,
      [orderNo, cont],
    );
    const { rows } = result;
    return rows;
  } catch (err) {
    console.log("there was an error verifying container", err.message);
  }
}

// procedure example
// returns Scac Codes based on organization
export async function getScacCodesByOrg(orgCode) {
  try {
    // oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; moved to top to see if affects all functions
    const result = await connection.execute(
      `BEGIN
      ${pkg}.xxbbna_warehouse_scac_code(:x_org_code, :x_scac_cur);
      END;`,
      {
        x_org_code: orgCode,
        x_scac_cur: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
    );
    const rs = result.outBinds.x_scac_cur;
    const rows = await rs.getRows();
    await rs.close();
    return rows;
  } catch (err) {
    console.log("there was an error getting scac codes", err.message);
  }
}

export function GetProductTypes() {
  const query = `SELECT product_type_id, product_type from XXBM_TRKLOADVER_PRD_TYPE`;
  return query;
}

export function GetCategoryProductTypes() {
  const query = `SELECT CATEGORY_PRD_TYPE_REL_ID, CATEGORY, PRODUCT_TYPE_ID from XXBM_TRKLOADVER_CAT_TYPE`;
  return query;
}

export function GetProductTypeQuestions() {
  const query = `SELECT product_type_ques_id, product_type_id, question FROM XXBM_TRKLOADVER_PRD_TYPE_QN`;
  return query;
}

export function GetProductTypeAnswers() {
  const query = `SELECT product_type_answer_id, product_type_ques_id, answers FROM XXBM_TRKLOADVER_PRD_TYPE_ans`;
  return query;
}

export function GetCatProdTypeRel() {
  const query = `SELECT category_prd_type_rel_id, CATEGORY, product_type_id FROM XXBM_TRKLOADVER_CAT_TYPE`;
  return query;
}

export function GetOrgCode() {
  const query = `SELECT mp.organization_code, mp.organization_id
    FROM   mtl_parameters mp
    WHERE  mp.organization_code IN ('ANN', 'EVA', 'STJ', 'VIS', 'JAC', 'MTY', 'RAI')`;
  return query;
}

export function GetScacCode() {
  const query = `SELECT scac_code, carrier_name FROM (SELECT scac_code,
                   carrier_name,
                   CASE
                     WHEN c.scac_code IN
                          ('PSTO', 'SQCH', 'TFEJ', 'MAV1', 'MTLA', 'WSXI', 'WSXI', 'TMCD', 'PRIJ', 'SWIT', 'MTBC') THEN
                      1
                     ELSE
                      2
                   END name_order
            FROM   apps.wsh_carriers_v C
            WHERE  c.active = 'A'
            AND    c.scac_code IS NOT NULL
            --and
            ORDER  BY 3, 2 ASC) x`;
  return query;
}

// returns all org codes
export async function getOrgCodes() {
  try {
    const result = await connection.execute(
      `BEGIN
      ${pkg}.xxbbna_warehouse_org_code(:x_org_cur);
      END;`,
      {
        x_org_cur: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
    );
    const rs = result.outBinds.x_org_cur;
    const rows = await rs.getRows();
    await rs.close();
    return rows;
  } catch (err) {
    console.log("error getting org codes", err.message);
  }
}

// returns all truck id for specified org
export async function getTruckIDByOrg(orgCode) {
  try {
    const result = await connection.execute(
      `BEGIN
      ${pkg}.xxbbna_warehouse_truck_id(:x_org_code, :x_truck_id_cur);
      END;`,
      {
        x_org_code: orgCode,
        x_truck_id_cur: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
    );
    const rs = result.outBinds.x_truck_id_cur;
    const rows = await rs.getRows();
    await rs.close();
    return rows;
  } catch (err) {
    console.log("error getting truck ids", err.message);
  }
}

// validates specified order and returns empty array if order is not assigned to this org id
export async function validateOrder(orgCode, orderNumber) {
  try {
    const result = await connection.execute(
      `SELECT DISTINCT ship_from_org_code, order_no FROM xxwsh_container_loading WHERE ship_from_org_code = :p1 AND order_no = :p2 `,
      {
        p1: orgCode,
        p2: orderNumber,
      },
    );
    const { rows } = result;
    return rows;
  } catch (err) {
    console.log("error validating order", err.message);
  }
}

/*
this appears to be working

[
  {
    SEQUENCE_NO: 1,
    CONT_NAME: '45799629',
    LineDescription: null,
    HEADER_DESC: 'SINGLE POINT',
    ORDER_NUMBER: 2600429001,
    SHIP_SET_NAME: null,
    CUSTOMER_NAME: 'PRECISION CONTRACTORS, INC.',
    SHIP_FROM_ORG_CODE: 'ANN',
    CATEGORY: 'Secondaries',
    TRANSACTION_TYPE: 'GB/WS-CUSTOM-BLDR',
    GROSS_WEIGHT: 12.04,
    REQUESTED_QUANTITY: 1,
    truck: null,
    'project_name ': null,
    cust_po_number: null,
    'plant_info_sup ': null,
    quantity_picked: null,
    'backordered_quantity ': null,
    extended_wt_sup: null,
    'part_number_sup ': null,
    STAGED_TRUCK_ID: null
  }
]

*/

export async function getLoadingShippingDetails(
  orgCode,
  orderNumber,
  truckName,
  processType,
  singlePointOrg,
  promiseDate,
) {
  try {
    const result = await connection.execute(
      `BEGIN
        ${pkg}.xxbbna_loading_shipping_proc_m(:p_org, :p_order_number, :p_truck_name, :p_process_type, :p_single_point_org, :p_promise_date, :p_order_details_cur);
      END;`,
      {
        p_org: orgCode,
        p_order_number: orderNumber,
        p_truck_name: truckName,
        p_process_type: processType,
        p_single_point_org: singlePointOrg,
        p_promise_date: promiseDate,
        p_order_details_cur: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
    );
    const rs = result.outBinds.p_order_details_cur;
    // let row;
    const rows = await rs.getRows(1);
    console.log("rows", rows);
    await rs.close();
    return rows;
  } catch (err) {
    console.log("error getting loading/shipping details", err.message);
  }
}

// export async function getTruckManifest(orgCode, truckID) {
//   try {
//     const result = await connection.execute(
//       `BEGIN
//         ${pkg}.xxbbna_truck_manifest_proc(:p_org_code, :p_truck, :p_truck_details_cur);
//       END;`,
//       {
//         p_org_code: orgCode,
//         p_truck: truckID,
//         p_truck_details_cur: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
//       },
//     );
//     const rs = result.outBinds.p_truck_details_cur;
//     const rows = await rs.getRows();
//     await rs.close();
//     return rows;
//   } catch (err) {
//     console.log("error getting truck manifest", err.message);
//   }
// }

export async function runTruckManifest(orgCode, truckID) {
  try {
    const result = await connection.execute(
      `BEGIN
        ${pkg}.xxbbna_truck_manifest_proc(:org, :truck, :cursor);
      END;`,
      {
        org: orgCode,
        truck: truckID,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      },
      {
        fetchArraySize: 1000,
      },
    );
    // console.log(result);
    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    console.log("rows", rows);
    console.log("internal", resultSet.metaData);
    await resultSet.close();
    return rows;
  } catch (err) {
    console.log("there was an error running truck manifest", err.message);
  }
}

// gets gross weight and gross qty from selected truck
export async function getLoadedTruckWeight(truckID) {
  try {
    const result = await connection.execute(
      `SELECT SUM(cont_qty) cont_qty, SUM(cont_gross_wt) cont_gross_wt FROM xxwsh_containers where truck_id_2 = :truckID`,
      { truckID },
    );
    const { rows } = result;
    return rows;
  } catch (err) {
    console.log("there was an error getting truck weight", err.message);
  }
}

// runs credit check on order
export async function runOrderCreditCheck(orderNumber, orgCode) {
  try {
    const result = await connection.execute(
      `BEGIN
      :ret := xxcustom_order_credit_check(:p_order_no, :p_org_code);
      END;`,
      {
        p_order_no: orderNumber,
        p_org_code: orgCode,
        ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      },
    );
    return result.outBinds;
  } catch (err) {
    console.log("error running credit check", err.message);
  }
}

// export async function runShowTruck(orderNumber, shipSetName, contName, org) {
//   try {
//     const result = await connection.execute(
//       `BEGIN
//         :ret := xxbm_wsh_packing_frm.show_truck(:p1, :p2, :p3, :p4);
//       END;`,
//       {
//         p1: orderNumber,
//         p2: shipSetName,
//         p3: contName,
//         p4: org,
//         ret: { dir: oracledb.BIND_OUT, type: oracledb.BOOLEAN },
//       },
//     );
//     return result.outBinds;
//   } catch (err) {
//     console.log("there was an error validating container", err.message);
//   }
//   // finally {
//   //   if (connection) {
//   //     await connection.close();
//   //   }
//   // }
// }

/*
both assigns a truck id to a package, and removes truck ids
the assignType variable determines whether the truck id is added or removed
A = add and R = remove

const add = await updateTruckID(
  2600429001,
  "1FSX",
  "ANN",
  "ANN",
  null,
  "PRIJ12345 090126",
  "A",
  122452,
  "PRIJ12345 090126",
  "M",
);

*/
export async function updateTruckID(
  orderNumber,
  contName,
  shipFromOrgCode,
  org,
  shipSetName,
  truckID,
  assignType,
  userID,
  headerTruck,
  truckFlag,
) {
  try {
    const result = await connection.execute(
      `BEGIN
        ${pkg}.xxbbna_update_truck_id(:order_number, :cont_name, :ship_from_org_code, :org, :ship_set_name, :truck_id, :assign_type, :user_id, :header_truck, :truck_flag, :status, :truck_weight, :truck_quantity);
      END;`,
      {
        order_number: orderNumber,
        cont_name: contName,
        ship_from_org_code: shipFromOrgCode,
        org: org,
        ship_set_name: shipSetName,
        truck_id: truckID,
        assign_type: assignType,
        user_id: userID,
        header_truck: headerTruck,
        truck_flag: truckFlag,
        status: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        truck_weight: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        truck_quantity: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
    );
    // const { status } = result.outBinds;
    // if (status !== "S") throw new Error(`Error updating TruckID: ${status}`);
    return result.outBinds;
  } catch (err) {
    console.log(err.message);
    return err.message;
  }
}

// gets all picked/loaded containers for specific order
export async function getAllContainersForOrder(orderNumber) {
  try {
    const result = await connection.execute(
      // `SELECT a.delivery_detail_id, a.cont_name, b.item_description, a.cont_qty, a.cont_gross_wt, a.direct_truck, a.order_number, b.shipping_instructions FROM XXBM_PICK_STATUS_REPORT_VW a, wsh_delivery_details b WHERE a.delivery_detail_id = b.delivery_detail_id AND a.order_number = :order_number ORDER BY cont_name`,
      `SELECT delivery_detail_id, order_no, cont_name, total_cont_qty AS cont_qty, total_gross_wt AS cont_gross_wt, ship_from_org_code, truck_id_2, ship_set_name, item_description, organization_id FROM (SELECT a.delivery_detail_id, a.order_no, a.cont_name, SUM(a.cont_qty) OVER (partition by a.cont_name) AS total_cont_qty, SUM(a.cont_gross_wt) OVER (partition by a.cont_name) AS total_gross_wt, a.ship_from_org_code, a.truck_id_2, a.ship_set_name, b.item_description, b.organization_id, ROW_NUMBER() OVER (PARTITION BY a.cont_name ORDER BY a.cont_name ASC) as rn FROM xxwsh_containers a, wsh_delivery_details b WHERE a.delivery_detail_id = b.delivery_detail_id AND a.order_no = :ordernumber ) WHERE rn = 1`,
      [orderNumber],
    );
    const { rows } = result;
    return rows;
  } catch (err) {
    console.log("there was an error fetching containers", err.message);
  }
}

// get unpicked containers?
export async function getUnpickedContainersForOrder(orderNumber) {
  try {
    console.log("getting containers...");
    const result = await connection.execute(
      `SELECT a.delivery_detail_id, a.cont_name, b.item_description, a.direct_truck, a.order_number, b.shipping_instructions FROM XXBM_PICK_STATUS_REPORT_VW a, wsh_delivery_details b WHERE a.delivery_detail_id = b.delivery_detail_id AND a.order_number = :order_number AND a.cont_name IS NULL ORDER BY cont_name`,
      [orderNumber],
    );
    const { rows } = result;
    return rows;
  } catch (err) {
    console.log("there was an error fetching unpicked containers", err.message);
  }
}

// gets name of customer on order
export async function getCustomerName(orderNumber) {
  try {
    const result = await connection.execute(
      `
    SELECT customer_name
    FROM (SELECT customer_name,
          ROW_NUMBER() OVER (PARTITION BY customer_name order by customer_name ASC) as rn
          FROM XXBM_PICK_STATUS_REPORT_VW a, apps.xxar_customers_v b, wsh_delivery_details c
          WHERE a.delivery_detail_id = c.delivery_detail_id
          AND b.customer_id = c.customer_id
          AND a.order_number = :order_number) WHERE rn = 1`,
      [orderNumber],
    );
    const { rows } = result;
    const data = rows[0];
    return rows;
  } catch (err) {
    // logger.trace();
    console.log("there was an error getting customer name", err.msg);
  }
}

// gets truck id by orgcode
export async function getTruckID(orgCode) {
  try {
    const result = await connection.execute(
      `SELECT truck_id  FROM   (SELECT xts.truck_id
    FROM   xxwsh_truck_shipment xts
    WHERE  xts.ship_date IS NULL
    AND    xts.shipment_type = 'I'
    AND    EXISTS
    (SELECT 1
    FROM xxwsh_container_loading xcl,
                    xxwsh_containers xc,
                    wsh.wsh_delivery_details wdd
                    WHERE  xcl.ship_from_org_code = :order_number
                    AND    NVL(xcl.btlr_ship_confirm, 'N') != 'Y'
                    AND    xc.order_no = xcl.order_no
                    AND    xc.ship_from_org_code = xcl.ship_from_org_code
                    AND    xc.cont_name = xcl.cont_name
                    AND    xc.ship_set_name = xcl.ship_set_name
                    AND    ((xcl.truck_id_1 = xts.truck_id AND xc.truck_id_1 = xcl.truck_id_1) OR
                    (xcl.staged_truck_id = xts.truck_id AND xc.staged_truck_id = xcl.staged_truck_id))
                    AND    wdd.delivery_detail_id = xc.delivery_detail_id
                    AND    wdd.released_status = 'Y')
                    UNION
                    SELECT xts.truck_id
                    FROM   xxwsh_truck_shipment xts
                    WHERE  xts.ship_date IS NULL
                    AND    xts.shipment_type = 'S'
                    AND    EXISTS (SELECT 1
                    FROM   xxwsh_container_loading xcl
                    WHERE  xcl.ship_set_name LIKE '%' || :order_number
                    AND    xcl.truck_id_2 = xts.truck_id
                    AND    NVL(xcl.btlr_ship_confirm, 'N') != 'Y')
                    UNION -- direct, no single point
                    SELECT xts.truck_id
                    FROM   xxwsh_truck_shipment xts
                    WHERE  xts.ship_date IS NULL
                    AND    xts.shipment_type = 'S'
                    AND    EXISTS (SELECT 1
                    FROM   xxwsh_container_loading xcl,
                    xxwsh_containers xc,
                    wsh.wsh_delivery_details wdd
                    WHERE  xcl.ship_from_org_code = :order_number
                    AND    xcl.truck_id_2 = xts.truck_id
                    AND    xcl.ship_set_name IS NULL
                    AND    NVL(xcl.btlr_ship_confirm, 'N') != 'Y'
                    AND    xc.order_no = xcl.order_no
                    AND    xc.ship_from_org_code = xcl.ship_from_org_code
                    AND    xc.cont_name = xcl.cont_name
                    AND    xc.ship_set_name IS NULL
                    AND    wdd.delivery_detail_id = xc.delivery_detail_id
                    AND    wdd.released_status = 'Y'))`,
      [orgCode],
    );
    const { rows } = result;
    return rows;
  } catch (err) {
    console.log("There was an error getting truck IDs", err.message);
  }
}

export async function populateTrucks(orgcode) {
  const list = await getTruckID(orgcode);
  try {
    for (let i = 0; i < list.length; i++) {
      const { TRUCK_ID } = list[i];
      insertIntoTable("Trucks", `('${TRUCK_ID}')`);
    }
  } catch (err) {
    console.log("there was an error populating trucks", err.message);
  }
}

/*
returns all order numbers for an organization
This would be called by query.getRows()
*/

export async function getAllOrdersByOrg(orgCode) {
  try {
    const query = await connection.execute(
      // `SELECT DISTINCT order_number, shipping_org FROM XXBM_PICK_STATUS_REPORT_VW WHERE released_status = 'Y' AND SHIPPING_ORG = :SHIPPING_ORG`,
      `SELECT DISTINCT order_number, shipping_org FROM XXBM_PICK_STATUS_REPORT_VW WHERE SHIPPING_ORG = :SHIPPING_ORG`,
      [orgCode],
      { resultSet: true },
    );
    return query.resultSet;
  } catch (err) {
    console.log("error getting orders", err.message);
  }
}

// export async function propagateOrders() {
//   // const orglist = ["ANN", "VIS", "JAC", "MTY", "STJ", "RAI", "EVA"];
//   try {
//     for (let i = 0; i < orglist.length; i++) {
//       const orgcode = orglist[i];
//       const list = await getAllOrdersByOrg(orgcode);
//       const result = await list.getRows();
//       for (let i = 0; i < result.length; i++) {
//         const { ORDER_NUMBER, SHIPPING_ORG } = result[i];
//         const insert = db.prepare(
//           `INSERT INTO Orders (orderNumber, orgCode) VALUES(?, ?)`,
//         );
//         insert.run(ORDER_NUMBER, SHIPPING_ORG);
//       }
//     }
//     console.log(`successfully inserted orders for ${orgcode} `);
//   } catch (err) {
//     console.log("error inserting into orders", err.message);
//   }
// }

// select * from MW_XXBM_ORDER_SCH WHERE order_number = '2600429001'
// this table has order number, customer name, and promise date

export async function getPromiseDate(orderNumber) {
  try {
    const result = await connection.execute(
      `SELECT a.order_number, a.promise_date, b.truck_id_2, c.DELIVERY_DETAIL_ID FROM mw_xxbm_order_sch_v2 a, xxwsh_containers b, apps.wsh_delivery_details c WHERE c.source_header_id = a.header_id AND c.delivery_detail_id = b.delivery_detail_id AND a.order_number = :ordernumber`,
      [orderNumber],
    );
    const { rows } = result;
    return rows;
  } catch (err) {
    console.log("error getting promise date", err.message);
  }
}

// export async function runLoadVerification() {
//   try {
//     result = await connection.execute(
//       `
//       `
//     )
//   }
// }

export async function loadVerificationType() {
  const VerifyType = await connection.getDbObjectClass(
    "INTERFACE.XXBBNA_WAREHOUSE_PROCESS_PKG.G_LOAD_VERIFICATION_RECORD",
  );
  const test = new VerifyType({});
}
