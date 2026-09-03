import oracledb from "oracledb";
import { pool } from "./pool.js";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
import { insertIntoTable } from "../db/handler.js";
dotenv.config({ path: "../server/.env" });

const connection = await pool.getConnection();
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
// const packageName = "XXBBNA_WAREHOUSE_PROCESS_PKG";
const pkg = process.env.PACKAGENAME;

// XXSHIP_SCHD_BY_ORG has order_no, orgcode/id, shipping method, notes, shipping instructions

// PRIJ12345 090126

// SELECT * FROM XXWSH_TRUCK_SHIPMENT WHERE TRUCK_ID = 'PRIJ12345 090126'

// MY user ID is 122452

/*
After assigning TruckID, container shows on xxwsh_container_loading
*/

/*
// SELECT * FROM XXWSH_CONTAINERS WHERE ORDER_NO = '2600429001' AND CONT_NAME = '14J'
This provides information for specific container in order. This table 

*/

// SELECT * FROM XXBM_PICK_STATUS_REPORT_VW WHERE order_number = '2600429001'
/*
SELECT * FROM xxwsh_containers
This shows truck ID assigned to container
SELECT * FROM XXWSH_CONTAINERS WHERE ORDER_NO = '2600429001'
this shows all containers assigned to this truck ID
*/

/*
SELECT * FROM wsh_delivery_details 912162
This shows Item_description
SELECT * FROM OE_ORDER_HEADERS_ALL WHERE HEADER_ID = '912162'
Order number 2600429001 is header_id 40328120
This ties order number to header_id maybe
*/

/*
create or replace PACKAGE           xxbm_shp_pkgload IS
  FUNCTION category_loc(p_location VARCHAR2, p_org_id NUMBER, p_cont_name VARCHAR DEFAULT NULL) RETURN VARCHAR2;
  FUNCTION remnum_retvar(p_var VARCHAR2) RETURN VARCHAR2;
  FUNCTION remvar_retnum(p_var VARCHAR2) RETURN NUMBER;
END xxbm_shp_pkgload;
*/

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
    return result.outBinds;
  } catch (err) {
    console.log("error getting operating unit ID", err.message);
  }
  // finally {
  //   if (connection) {
  //     await connection.close();
  //   }
  // }
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
  // finally {
  //   if (connection) {
  //     await connection.close();
  //   }
  // }
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
  // finally {
  //   if (connection) {
  //     await connection.close();
  //   }
  // }
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
  // finally {
  //   if (connection) {
  //     await connection.close();
  //   }
  // }
}

// validates specified order
export async function validateOrder(orgCode, orderNumber) {
  try {
    const result = await connection.execute(
      `BEGIN
        :ret := ${pkg}.xxbbna_warehouse_valid_order(:p_org_code, :p_order_number);
      END;`,
      {
        p_org_code: orgCode,
        p_order_number: orderNumber,
        ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      },
    );
    return result.outBinds;
  } catch (err) {
    console.log("error validating order", err.message);
  }
  // finally {
  //   if (connection) {
  //     await connection.close();
  //   }
  // }
}

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
    const rows = await rs.getRows();
    await rs.close();
    return rows;
  } catch (err) {
    console.log("error getting loading/shipping details", err.message);
  }
  // finally {
  //   if (connection) {
  //     await connection.close();
  //   }
  // }
}

export async function getTruckManifest(orgCode, truckID) {
  try {
    const result = await connection.execute(
      `BEGIN
        ${pkg}.xxbbna_truck_manifest_proc(:p_org_code, :p_truck, :p_truck_details_cur);
      END;`,
      {
        p_org_code: orgCode,
        p_truck: truckID,
        p_truck_details_cur: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      },
    );
    const rs = result.outBinds.p_truck_details_cur;
    const rows = await rs.getRows();
    await rs.close();
    return rows;
  } catch (err) {
    console.log("error getting truck manifest", err.message);
  }
  // finally {
  //   if (connection) {
  //     await connection.close();
  //   }
  // }
}

export async function getLoadedTruckWeight(orgCode, truckID) {
  try {
    const result = await connection.execute(
      `BEGIN
        ${pkg}.xxbbna_truck_weight_qty_proc(:p_org, :p_truck, :p_truck_weight, :p_truck_quantity, :p_stagged_weight);
      END;`,
      {
        p_org: orgCode,
        p_truck: truckID,
        p_truck_weight: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        p_truck_quantity: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        p_stagged_weight: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
    );
    return result.outBinds;
  } catch (err) {
    console.log("error getting loaded truck weight", err.msg);
  }
  // finally {
  //   if (connection) {
  //     await connection.close();
  //   }
  // }
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
  // finally {
  //   if (connection) {
  //     await connection.close();
  //   }
  // }
}

export async function runShowTruck(orderNumber, shipSetName, contName, org) {
  try {
    const result = await connection.execute(
      `BEGIN
        :ret := xxbm_wsh_packing_frm.show_truck(:p1, :p2, :p3, :p4);
      END;`,
      {
        p1: orderNumber,
        p2: shipSetName,
        p3: contName,
        p4: org,
        ret: { dir: oracledb.BIND_OUT, type: oracledb.BOOLEAN },
      },
    );
    return result.outBinds;
  } catch (err) {
    console.log("there was an error validating container", err.message);
  }
  // finally {
  //   if (connection) {
  //     await connection.close();
  //   }
  // }
}

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
    return result.outBinds;
  } catch (err) {
    console.log("there was an error updating truck id", err.message);
  }
  // finally {
  //   if (connection) {
  //     await connection.close();
  //   }
  // }
}

// gets all containers for specific order
export async function getAllContainersForOrder(orderNumber) {
  try {
    const result = await connection.execute(
      // `SELECT a.delivery_detail_id, a.cont_name, b.item_description, a.cont_qty, a.cont_gross_wt, a.direct_truck, a.order_no FROM XXBM_PICK_STATUS_REPORT_VW a, wsh_delivery_details b WHERE a.delivery_detail_id = b.delivery_detail_id AND a.order_no = :order_number`,
      `SELECT a.delivery_detail_id, a.cont_name, b.item_description, a.cont_qty, a.cont_gross_wt, a.direct_truck, a.order_number, b.shipping_instructions FROM XXBM_PICK_STATUS_REPORT_VW a, wsh_delivery_details b WHERE a.delivery_detail_id = b.delivery_detail_id AND a.order_number = :order_number AND a.released_status = 'Y' ORDER BY cont_name`,
      [orderNumber],
    );
    console.log("result", result);
    const { rows } = result;
    return rows;
  } catch (err) {
    console.log("there was an error fetching containers", err.message);
  }
  // finally {
  //   if (connection) {
  //     await connection.close();
  //   }
  // }
}

// gets name of customer on order
export async function getCustomerName(orderNumber) {
  try {
    const result = await connection.execute(
      `
          SELECT customer_name
    FROM (SELECT customer_name
          FROM XXBM_PICK_STATUS_REPORT_VW a, apps.xxar_customers_v b, wsh_delivery_details c
          WHERE a.delivery_detail_id = c.delivery_detail_id
          AND b.customer_id = c.customer_id
          AND a.order_number = :order_number
          ORDER BY customer_name ASC FETCH FIRST 1 ROWS ONLY
    )`,
      [orderNumber],
    );
    const { rows } = result;
    const data = rows[0];
    return rows;
  } catch (err) {
    // logger.trace();
    console.log("there was an error getting customer name", err.msg);
  }
  // finally {
  //   if (connection) {
  //     await connection.close();
  //   }
  // }
}

// gets truck id by orgcode
export async function getTruckID(orgCode) {
  // if (!connection) {
  //   const connection = await pool.getConnection();
  // }
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
  // finally {
  //   if (connection) {
  //     await connection.close();
  //   }
  // }
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
  // finally {
  //   if (connection) {
  //     await connection.close();
  //   }
  // }
}
