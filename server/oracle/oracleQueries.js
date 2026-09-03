import oracledb from "oracledb";
import { pool } from "./pool.js";
import * as proc from "./procedures.js";
import {
  createProductType,
  createTable,
  dropTable,
  insertIntoTable,
  getOrgCodes,
} from "../db/handler.js";
import { CategoryProductRel } from "../models/CategoryProductRel.js";
import { getTruckID } from "./functions.js";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const connection = await pool.getConnection();

export async function testConnection(req, res) {
  try {
    const connection = await pool.getConnection();
    const result = await connection.isHealthy();
    const name = await connection.dbName;
    if (result) {
      res.status(200);
    } else {
      res.status(500);
    }
    await connection.close();
  } catch (err) {
    return err;
  }
}
// testConnection();

// pulls all OrgCodes from Oracle
export async function GetOrgCode(req, res) {
  try {
    const connection = await pool.getConnection();
    const query = proc.GetOrgCode();
    const { rows } = await connection.execute(query);
    return rows;
    await connection.close();
  } catch (err) {
    res.send({ error: err.message });
  }
}
// populates local tables with org code data
export async function PopulateOrgCode() {
  const list = await GetOrgCode();
  let changes = 0;
  try {
    for (let i = 0; i < list.length; i++) {
      try {
        const { ORGANIZATION_CODE } = list[i];
        const { ORGANIZATION_ID } = list[i];
        const result = insertIntoTable(
          "OrgCodes",
          `('${ORGANIZATION_ID}', '${ORGANIZATION_CODE}')`,
        );
        changes++;
      } catch (err) {
        console.log("Org Codes list error", err.message);
      }
    }
  } catch (err) {
    console.log("Org Codes fn error", err.message);
  }
  console.log(`Updated OrgCodes with ${changes} total changes`);
}

// PopulateOrgCode();

export async function GetScac() {
  try {
    const connection = await pool.getConnection();
    const query = proc.GetScacCode();
    const { rows } = await connection.execute(query);
    return rows;
    await connection.close();
  } catch (err) {
    return err;
  }
}

export async function PopulateScac() {
  const list = await GetScac();
  try {
    for (let i = 0; i < list.length; i++) {
      const { SCAC_CODE } = list[i];
      const { CARRIER_NAME } = list[i];
      const values = `('${SCAC_CODE}', '${CARRIER_NAME}')`;
      insertIntoTable("ScacTable", values);
      console.log("scac tables populated");
    }
  } catch (err) {
    console.log("error populating scac", err.message);
  }
}

export async function GetTrucks(orgCode) {
  let list = [];
  try {
    // const connection = await pool.getConnection();
    // const query = proc.GetTruckID(orgCode);
    const query = await getTruckID(orgCode);
    for (let i = 0; i < query.length; i++) {
      const { TRUCK_ID } = query[i];
      list.push(TRUCK_ID);
    }
    return list;
  } catch (err) {
    console.log("error", err.message);
  }
}

async function getTrucksPre(orgcode) {
  try {
    let trucks = [];
    console.log(`getting trucks for ${orgcode}`);
    const list = await GetTrucks(orgcode);
    for (let i = 0; i < list.length; i++) {
      const { TRUCK_ID } = list[i];
      trucks.push(TRUCK_ID);
    }
    return trucks;
  } catch (err) {
    console.log("err", err.message);
  }
}

// export async function PopulateTrucks(orgcode) {
//   tru
// }

export async function PopulateTrucks() {
  try {
    const orgCodes = ["ANN", "VIS", "JAC", "MTY", "STJ", "RAI", "EVA"];
    console.log("orgcodes", orgCodes);
    // console.log("starting populate");
    const obj = { org: "", truckid: "" };
    for (let i = 0; i < orgCodes.length; i++) {
      const trucks = await GetTrucks(orgCodes[i]);
      const org = orgCodes[i];
      for (let i = 0; i < trucks.length; i++) {
        const newObj = { ...obj, org: org, truckid: trucks[i] };
        const values = `('${newObj.truckid}', '${newObj.org}')`;
        insertIntoTable("Trucks", values);
      }
    }
  } catch (err) {
    console.log("error populating trucks", err.message);
  }
}

// procedure
// process type can be T O or S
export async function getLoadingShippingDetails() {
  const query = await connection.execute(
    `BEGIN
      xxbbna_loading_shipping_proc_m(:org, :order_number, :truck_name, :process_type, :single_point_org, :promise_date, :order_details);
    END;`,
    {
      org: "ANN",
      order_number: 2600429001,
      truck_name: "2600429001T1",
      process_type: "S",
      single_point_org: "",
      promise_date: "",
      order_details: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_OBJECT },
    },
  );
  const { outBinds } = query;
  return query;
}

// function
export async function runVerifyOrder(orgCode, orderNumber) {
  const query = await connection.execute(
    `BEGIN
    :ret := xxbbna_warehouse_valid_order(:p1, :p2);
    END;`,
    {
      p1: orgCode,
      p2: orderNumber,
      ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
    },
  );
  const result = query.outBinds;
  return result;
}

export async function GetProductQuestionaireResponse() {
  try {
    const connection = await pool.getConnection();
    const query = proc.GetProductTypeQuestions();
    const { rows } = await connection.execute(query);
    return rows;
    await connection.close();
  } catch (err) {
    console.log("there was an error", err.message);
  }
}

//console.log(await GetProductQuestionaireResponse());

export async function PopulateProductQuestions() {
  const list = await GetProductQuestionaireResponse();
  let changes = 0;
  createTable(
    "ProductTypeQuestions",
    "ProductTypeQuestionID INTEGER, ProductTypeID INTEGER, Question TEXT, ProductTypeName TEXT",
  );
  try {
    for (const item of list) {
      try {
        const values = `('${item[0]}', '${item[1]}', '${item[2]}', '')`;
        const result = insertIntoTable("ProductTypeQuestions", values);
        changes++;
      } catch (err) {
        console.log("Prod Questions list error", err.message);
      }
    }
  } catch (err) {
    console.log("Prod Question fn error", err.message);
  }
  console.log(`Updated ProductTypeQuestions with ${changes} total changes`);
}

export async function GetProductAnswersResponse() {
  try {
    const connection = await pool.getConnection();
    const query = proc.GetProductTypeAnswers();
    const { rows } = await connection.execute(query);
    return rows;
    await connection.close();
  } catch (err) {
    console.log("There was an error", err.message);
  }
}

export async function PopulateProductAnswers() {
  const list = await GetProductAnswersResponse();
  let changes = 0;
  createTable(
    "ProductTypeAnswers",
    "ProductTypeAnswerID INTEGER, ProductTypeQuestionID INTEGER, Answer TEXT, IsSelected INTEGER",
  );
  try {
    for (const item of list) {
      try {
        const values = `('${item[0]}', '${item[1]}', '${item[2]}', '0')`;
        const result = insertIntoTable("ProductTypeAnswers", values);
        changes++;
      } catch (err) {
        console.log("Prod Answers list error", err.message);
      }
    }
  } catch (err) {
    console.log("Prod Answer fn error", err.message);
  }
  console.log(`Updated ProductTypeAnswers with ${changes} total changes`);
}
//PopulateProductAnswers();

export async function GetProductTypeResponse() {
  try {
    const connection = await pool.getConnection();
    const query = proc.GetProductTypes();
    const { rows } = await connection.execute(query);
    return rows;
    await connection.close();
  } catch (err) {
    console.log("there was an error", err.message);
  }
}

// console.log(GetProductTypeResponse());

export async function PopulateProductType() {
  const list = await GetProductTypeResponse();
  let changes = 0;
  dropTable("ProductType");
  createProductType();
  try {
    for (const item of list) {
      try {
        const values = `('${item[0]}', '${item[1]}')`;
        const result = insertIntoTable("ProductType", values);
        changes++;
      } catch (err) {
        console.log("list error", err.message);
      }
    }
  } catch (err) {
    console.log("FN Error", err.message);
  }

  console.log(`Updated ProductType with ${changes} total changes`);
}
//PopulateProductType();

export async function GetCatProdTypeRel() {
  try {
    const connection = await pool.getConnection();
    const query = proc.GetCatProdTypeRel();
    const { rows } = await connection.execute(query);
    return rows;
    await connection.close();
  } catch (err) {
    console.log("catproderror", err.message);
  }
}

// console.log(await GetCatProdTypeRel());

export async function PopulateCategoryProductRel() {
  const list = await GetCatProdTypeRel();
  createTable(
    "CategoryProductRel",
    "categoryProductRelID INTEGER, category TEXT, productTypeID INTEGER",
  );
  let changes = 0;
  try {
    for (const item of list) {
      try {
        const values = `('${item[0]}', '${item[1]}', '${item[2]}')`;
        const result = insertIntoTable("CategoryProductRel", values);
        changes++;
      } catch (err) {
        // throw new Error("There was an issue with CategoryProductRel List");
        console.log(err.message);
      }
    }
  } catch (err) {
    console.log("There was an error with CatProd FN", err.message);
  }

  console.log(`Updated CategoryProductRel with ${changes} total changes`);
}

// PopulateCategoryProductRel();

// this works
async function mtl() {
  try {
    const connection = await pool.getConnection();
    const result = await connection
      .execute
      // "SELECT *  FROM mtl_parameters",
      // "SELECT * FROM APPS.WSH_CARRIERS_V OFFSET 0 ROWS FETCH NEXT 20 ROWS ONLY",
      ();

    // let columnData = [];
    // for (let i = 0; i < data.length; i++) {
    //   const columns = data[i].dbColumnName;
    //   console.log(columns);
    //   columnData.push(columns);
    // }

    console.log(result.rows);

    // await data.close();

    // const j = JSON.parse(d);

    // console.log("done");

    // console.log("result", result.rows, { depth: "null" });
    await connection.close();
  } catch (err) {
    console.error("err", err.message);
  }
}
// mtl();

/*

This returns each row indivually, and notates which row you are on 

    const data = result.resultSet;
      let row;
    let i = 1;
    while ((row = await data.getRow())) {
      console.log("getRow(): row " + i++);
      console.log(row);
    }

    */

const xxbbna_warehouse_org_code = `SELECT truck_id
    FROM   (SELECT xts.truck_id
            FROM   xxwsh_truck_shipment xts
            WHERE  xts.ship_date IS NULL
            AND    xts.shipment_type = 'I'
            AND    EXISTS
             (SELECT 1
                    FROM   xxwsh_container_loading xcl,
                           xxwsh_containers        xc,
                           wsh.wsh_delivery_details          wdd
                    WHERE  xcl.ship_from_org_code = 'ANN'
                    AND    NVL(xcl.btlr_ship_confirm, 'N') != 'Y'
                    AND    xc.order_no = xcl.order_no
                    AND    xc.ship_from_org_code = xcl.ship_from_org_code
                    AND    xc.cont_name = xcl.cont_name
                    AND    xc.ship_set_name = xcl.ship_set_name
                    AND    ((xcl.truck_id_1 = xts.truck_id AND xc.truck_id_1 = xcl.truck_id_1) OR
                          (xcl.staged_truck_id = xts.truck_id AND xc.staged_truck_id = xcl.staged_truck_id))
                    AND    wdd.delivery_detail_id = xc.delivery_detail_id
                    AND    wdd.released_status = 'Y') -- pick released
            UNION -- direct leg after single point
            SELECT xts.truck_id
            FROM   xxwsh_truck_shipment xts
            WHERE  xts.ship_date IS NULL
            AND    xts.shipment_type = 'S'
            AND    EXISTS (SELECT 1
                    FROM   xxwsh_container_loading xcl
                    WHERE  xcl.ship_set_name LIKE '%'
                          --AND  xcl.ship_set_name IS NOT NULL
                          --AND  xcl.ship_from_org_code = x_org_code
                    AND    xcl.truck_id_2 = xts.truck_id
                    AND    NVL(xcl.btlr_ship_confirm, 'N') != 'Y')
            UNION -- direct, no single point
            SELECT xts.truck_id
            FROM   xxwsh_truck_shipment xts
            WHERE  xts.ship_date IS NULL
            AND    xts.shipment_type = 'S'
            AND    EXISTS (SELECT 1
                    FROM   xxwsh_container_loading xcl,
                           xxwsh_containers        xc,
                           wsh.wsh_delivery_details          wdd
                    WHERE  xcl.ship_from_org_code = 'STJ'
                    AND    xcl.truck_id_2 = xts.truck_id
                    AND    xcl.ship_set_name IS NULL
                    AND    NVL(xcl.btlr_ship_confirm, 'N') != 'Y'
                    AND    xc.order_no = xcl.order_no
                    AND    xc.ship_from_org_code = xcl.ship_from_org_code
                    AND    xc.cont_name = xcl.cont_name
                    AND    xc.ship_set_name IS NULL
                    AND    wdd.delivery_detail_id = xc.delivery_detail_id
                    AND    wdd.released_status = 'Y'))`;

/*
-- SELECT * FROM wsh_delivery_details WHERE delivery_detail_id = '123208564'
-- SELECT * FROM XXWSH_CONTAINERS WHERE delivery_detail_id = '11474604'
SELECT * FROM XXBM_PICK_STATUS_REPORT_VW WHERE ROWID IN (SELECT MIN(ROWID) FROM XXBM_PICK_STATUS_REPORT_VW GROUP BY cont_name) ORDER BY cont_name
-- SELECT a.delivery_detail_id, a.cont_name, b.item_description, a.cont_qty, a.cont_gross_wt, a.direct_truck, a.order_number FROM XXBM_PICK_STATUS_REPORT_VW a, wsh_delivery_details b WHERE a.delivery_detail_id = b.delivery_detail_id AND a.order_number = '2600429001' AND a.released_status = 'Y' ORDER BY cont_name
*/
