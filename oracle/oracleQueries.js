import oracledb from "oracledb";
import { pool } from "../db/pool.js";
import fs from "node:fs";
import { json } from "body-parser";

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    // oracledb.initOracleClient();
    const result = await connection.isHealthy();
    const name = await connection.dbName;
    const instance = await connection.getSodaDatabase();
    console.log(instance.getCollectionNames());
    await connection.close();
    return result;
  } catch (err) {
    // console.log("there was an error", err);
    return err;
  }
}

// testConnection();

// this works

// `SELECT mp.organization_code
//     BULK   COLLECT
//     INTO   l_org_code
//     FROM   mtl_parameters mp
//     WHERE  mp.organization_code IN ('ANN', 'EVA', 'STJ', 'VIS', 'JAC', 'MTY', 'RAI');
//     x_org_table := l_org_code;
//   EXCEPTION
//     WHEN others THEN
//       dbms_output.put_line('Exception ------ ' || sqlerrm);`;

async function mtl() {
  try {
    const connection = await pool.getConnection();
    const result = await connection.execute(
      // "SELECT *  FROM mtl_parameters",
      // "SELECT * FROM APPS.WSH_CARRIERS_V OFFSET 0 ROWS FETCH NEXT 20 ROWS ONLY",

    );

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
mtl();

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

const xxbbna_warehouse_org_code =       `SELECT truck_id
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
                    AND    wdd.released_status = 'Y'))`,