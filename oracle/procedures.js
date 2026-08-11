import sql from "sql-template-tag";
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
  const query = `SELECT mp.organization_code
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

export function GetTruckID(orgCode) {
  const query = sql`SELECT truck_id  FROM   (SELECT xts.truck_id
            FROM   xxwsh_truck_shipment xts
            WHERE  xts.ship_date IS NULL
            AND    xts.shipment_type = 'I'
            AND    EXISTS
             (SELECT 1
                    FROM xxwsh_container_loading xcl,
                    xxwsh_containers xc,
                    wsh.wsh_delivery_details wdd
                    WHERE  xcl.ship_from_org_code = ${orgCode}
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
                    WHERE  xcl.ship_set_name LIKE '%' || ${orgCode}
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
                    WHERE  xcl.ship_from_org_code = ${orgCode}
                    AND    xcl.truck_id_2 = xts.truck_id
                    AND    xcl.ship_set_name IS NULL
                    AND    NVL(xcl.btlr_ship_confirm, 'N') != 'Y'
                    AND    xc.order_no = xcl.order_no
                    AND    xc.ship_from_org_code = xcl.ship_from_org_code
                    AND    xc.cont_name = xcl.cont_name
                    AND    xc.ship_set_name IS NULL
                    AND    wdd.delivery_detail_id = xc.delivery_detail_id
                    AND    wdd.released_status = 'Y'))`;
  return query;
}
