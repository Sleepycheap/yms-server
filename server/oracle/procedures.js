import sql from "sql-template-tag";
import { pool } from "./pool.js";

const connection = await pool.getConnection();

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

export async function createGetIPPlant() {
  const result = connection.execute(`
  CREATE OR REPLACE FUNCTION get_ip_plant(p_value_set IN VARCHAR2, p_flex_value IN VARCHAR2) RETURN VARCHAR2 IS
    v_description apps.fnd_flex_values_vl.description%TYPE;
  BEGIN
    SELECT ffv.description
    INTO   v_description
    FROM   applsys.fnd_flex_value_sets ffs, apps.fnd_flex_values_vl ffv
    WHERE  ffs.flex_value_set_name = p_value_set
    AND    ffs.flex_value_set_id = ffv.flex_value_set_id
    AND    ffv.flex_value = p_flex_value;

    RETURN v_description;
  EXCEPTION
    WHEN no_data_found THEN
      v_description := 'No data';
      RETURN v_description;
    WHEN others THEN
      dbms_output.put_line('ERROR: ' || sqlerrm);
      RETURN NULL;
  END get_ip_plant;`);
  return result;
}

export async function createLoadingShippingProc() {
  const result = connection.execute(
    `CREATE OR REPLACE PROCEDURE xxbbna_loading_shipping_proc_m(
      p_org IN VARCHAR2,
      p_order_number IN NUMBER,
      p_truck_name IN VARCHAR2,
      p_process_type IN VARCHAR2,
      --p_direct_load IN VARCHAR2,
      p_single_point_org IN VARCHAR2,
      p_promise_date IN VARCHAR2,
      p_order_details OUT XXBBNA_SHIPPPING_ORDER_DETAILS.g_shipping_order_details_tbl)
      AS
      l_order_details XXBBNA_SHIPPPING_ORDER_DETAILS.g_shipping_order_details_tbl;
      lv_org_id NUMBER := xxbbna_get_operating_unit_id(p_org);
      lv_org_inv_id NUMBER := xxbbna_get_operating_inv_id(p_org);
      v_count NUMBER;
      v_truck_name VARCHAR2(100); 

      CURSOR cur_orderd_det(p_org IN VARCHAR2, p_single_point_org IN VARCHAR2, c_promise_date IN VARCHAR2) IS
      SELECT ROW_NUMBER() OVER(ORDER BY SUBSTR(cont_name, INSTR(TRANSLATE(UPPER(cont_name), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '--------------------------'), '-'))) sequence_no,
             shpp.*
      FROM   (SELECT sall.cont_name,
                      xxcustom_get_desc(sall.order_number, sall.cont_name) "LineDescription",
                      DECODE(sall.ship_from, 1, 'DIRECT SHIPMENTS', 2, 'SINGLE POINT', 3, 'SINGLE POINT', 4, 'EXCEPTIONS') header_desc,
                      NVL(sall.order_number, 0) order_number,
                      sall.ship_set_name,
                      sall.customer_name,
                      sall.ship_from_org_code,
                      sall.category,
                      sall.transaction_type,
                      NVL(SUM(sall.gross_weight), 0) gross_weight,
                      NVL(SUM(sall.requested_quantity), 0) requested_quantity,
                      xxcustom_get_truck_id(sall.order_number,
                        sall.cont_name,
                        sall.ship_from_org_code,
                        p_org,
                        sall.ship_set_name) "truck",
                      NULL "project_name ",
                      NULL "cust_po_number",
                      NULL "plant_info_sup ",
                      NULL "quantity_picked",
                      NULL "backordered_quantity ",
                      NULL "extended_wt_sup",
                      NULL "part_number_sup ",
                      sall.staged_truck_id
               FROM   (SELECT xf.*,
                              DECODE(xf.ship_from_group,
                                     1,
                                     DECODE(xf.created_shipping_instructions, NULL, 1, 3),
                                     2,
                                     DECODE(xf.released_status, 'Y', 2, 'C', DECODE(xf.truck_not_null, 'NULL', 4, 2)),
                                     2) ship_from
                       FROM   (SELECT xx.cont_name,
                                      xx.linedescription,
                                      xx.order_number,
                                      xx.ship_set_name,
                                      xx.customer_name,
                                      xx.ship_from_org_code,
                                      interface.xxbm_shp_pkgload.category_loc(xx.location,
                                                                              xx.ship_from_org_id,
                                                                              xx.cont_name) CATEGORY,
                                      xx.transaction_type,
                                      xx.gross_weight,
                                      xx.requested_quantity,
                                      xx.delivery_detail_id,
                                      DECODE(xx.ip_plant,
                                             NULL,
                                             DECODE(xx.ship_set_name,
                                                    NULL,
                                                    '1',
                                                    DECODE(SUBSTR(xx.ship_set_name, 5, 3), p_org, '1', '2')),
                                             '3') ship_from_group,
                                      DECODE(xx.ship_set_name,
                                             NULL,
                                             DECODE(xx.ip_plant, NULL, NULL, xx.ship_from_org_code || '-' || xx.ip_plant),
                                             xx.ship_set_name) created_shipping_instructions,
                                      xx.truck_not_null,
                                      xx.released_status,
                                      xx.ship_from_org_id,
                                      xx.staged_truck_id
                               FROM   (SELECT xc.cont_name,
                                              NULL linedescription,
                                              xta.order_number,
                                              xc.ship_set_name,
                                              xc.ship_from_org_code,
                                              xc.ship_from_org_id,
                                              xc.location,
                                              xc.cont_gross_wt gross_weight,
                                              xc.cont_qty requested_quantity,
                                              get_ip_plant('XXBM_IP_PLANT_XREF', rc.customer_number) ip_plant,
                                              LTRIM(RTRIM(rc.customer_name)) customer_name,
                                              ott.name transaction_type,
                                              wdd.released_status,
                                              wdd.delivery_detail_id,
                                              MIN(DECODE(xc.truck_id_1, NULL, 'NULL', 'NOT_NULL')) truck_not_null,
                                              xc.staged_truck_id
                                       FROM   xxbm_order_truck_activity xta,
                                              xxwsh_containers          xc,
                                              ont.oe_order_headers_all            oh,
                                              wsh.wsh_delivery_details            wdd,
                                              apps.xxar_customers_v               rc,
                                              ont.oe_transaction_types_tl         ott
                                       WHERE  xta.order_number = oh.order_number
                                       AND    xta.order_number = xc.order_no
                                       AND    oh.header_id = wdd.source_header_id
                                       AND    xc.delivery_detail_id = wdd.delivery_detail_id
                                       AND    wdd.customer_id = rc.customer_id
                                       AND    oh.order_type_id = ott.transaction_type_id
                                       AND    ott.language = 'US'
                                       AND    wdd.pickable_flag = 'Y'
                                       AND    NVL(INSTR(xc.ship_set_name, p_org), 0) +
                                              NVL(INSTR(xc.ship_from_org_code, p_org), 0) > 0
                                       AND    NOT EXISTS (SELECT NULL
                                               FROM   oe_order_lines ol
                                               WHERE  ol.header_id = oh.header_id
                                               AND    ol.line_id = wdd.source_line_id
                                               AND    ol.flow_status_code = 'CANCELLED')
                                       AND    EXISTS
                                        (SELECT NULL
                                               FROM   xxwsh_container_loading xcd
                                               WHERE  xcd.order_no = oh.order_number
                                               AND    xcd.cont_name = xc.cont_name
                                               AND    xta.truck_name IN (xcd.truck_id_1, xcd.truck_id_2, xcd.staged_truck_id)
                                               AND    NVL(p_process_type, 'A') = 'S'
                                               UNION ALL
                                               SELECT NULL
                                               FROM   ont.oe_order_lines_all ol
                                               WHERE  ol.header_id = wdd.source_header_id
                                               AND    ol.line_id = wdd.source_line_id
                                               AND    ol.flow_status_code != 'CLOSED'
                                               AND    ol.flow_status_code != 'CANCELLED'
                                               AND    NVL(xc.truck_id_1, NVL(xc.truck_id_2, xc.staged_truck_id)) IS NULL
                                               AND    NVL(p_process_type, 'A') = 'S'
                                               AND    ol.shipping_instructions = p_single_point_org
                                               AND    TRUNC(ol.promise_date) = TRUNC(TO_DATE(c_promise_date, 'MM/DD/YYYY'))
                                               UNION ALL
                                               SELECT NULL
                                               FROM   dual
                                               WHERE  NVL(p_process_type, 'A') != 'S'
                                               UNION ALL
                                               SELECT NULL
                                               FROM   wsh.wsh_delivery_details wdd1
                                               WHERE  wdd1.org_id = oh.org_id
                                               AND    wdd1.source_header_id = oh.header_id
                                               AND    wdd1.customer_id = oh.sold_to_org_id
                                               AND    wdd1.pickable_flag = 'Y'
                                               AND    wdd1.released_status = 'Y'
                                               AND    NVL(wdd1.picked_quantity, 0) > 0

                                               )
                                       GROUP  BY wdd.delivery_detail_id,
                                                 xc.cont_name,
                                                 xta.order_number,
                                                 xc.ship_set_name,
                                                 xc.ship_from_org_code,
                                                 xc.ship_from_org_id,
                                                 xc.location,
                                                 xc.cont_gross_wt,
                                                 xc.cont_qty,
                                                 LTRIM(RTRIM(rc.customer_name)),
                                                 rc.customer_number,
                                                 ott.name,
                                                 wdd.released_status,
                                                 xc.staged_truck_id) xx) xf) sall
               GROUP  BY sall.created_shipping_instructions,
                         sall.cont_name,
                         sall.ship_from,
                         sall.ship_from_group,
                         sall.order_number,
                         sall.ship_set_name,
                         sall.customer_name,
                         sall.ship_from_org_code,
                         sall.ship_from_org_id,
                         sall.category,
                         sall.transaction_type,
                         sall.staged_truck_id
               UNION ALL
               SELECT NULL "cont_name",
                      part_number "LineDescription",
                      'UNPICKED ITEMS' "header_desc",
                      NVL(order_number, 0) ord_num,
                      NULL "ship_set_name",
                      customer_name customer,
                      NULL "ship_from_org_code",
                      CATEGORY loc_category,
                      trx_type,
                      NVL(SUM(gross_weight), 0) prt_gross_weight,
                      NVL(SUM(gross_qty), 0) prt_gross_qty,
                      truck null_truck,
                      NULL "project_name ",
                      NULL "cust_po_number",
                      NULL "plant_info_sup ",
                      NULL "quantity_picked",
                      NULL "backordered_quantity ",
                      NULL "extended_wt_sup",
                      NULL "part_number_sup ",
                      NULL staged_truck_id
               FROM   (SELECT oh.order_number,
                              rc.customer_name,
                              ott.name trx_type,
                              interface.xxbm_shp_pkgload.category_loc(msib.attribute2, ol.ship_from_org_id) CATEGORY,
                              NULL CONTAINER,
                              msib.segment1 part_number,
                              (msib.unit_weight * ol.ordered_quantity) gross_weight,
                              (ol.ordered_quantity) gross_qty,
                              ol.shipping_instructions,
                              NULL truck
                       FROM   oe_order_headers                    oh,
                              oe_order_lines                      ol,
                              apps.oe_transaction_types_vl        ott,
                              inv.mtl_system_items_b              msib,
                              apps.xxar_customers_v               rc,
                              xxbm_order_truck_activity xta
                       WHERE  xta.order_number = oh.order_number
                       AND    oh.header_id = ol.header_id
                       AND    oh.order_type_id = ott.transaction_type_id
                       AND    oh.sold_to_org_id = rc.customer_id
                       AND    ol.shippable_flag = 'Y'
                       AND    ol.source_type_code = 'INTERNAL'
                       AND    ol.flow_status_code NOT IN ('CLOSED', 'CANCELLED')
                       AND    msib.inventory_item_id = ol.inventory_item_id
                       AND    msib.organization_id = ol.ship_from_org_id
                       AND    msib.item_type NOT IN ('PR', 'CR')
                       AND    (ol.ship_from_org_id = lv_org_inv_id OR INSTR(ol.shipping_instructions, p_org) > 0)
                             --AND    oh.order_number = p_order_number --1501720502-- 1501720501
                       AND    (EXISTS (SELECT NULL
                                       FROM   apps.wsh_delivery_details wdd
                                       WHERE  wdd.source_header_id = oh.header_id
                                       AND    wdd.source_line_id = ol.line_id
                                       AND    wdd.pickable_flag = 'Y'
                                       AND    wdd.released_status IN ('B', 'R', 'S')
                                       AND    NVL(wdd.picked_quantity, 0) = 0) OR NOT EXISTS
                              (SELECT *
                                FROM   xxwsh_containers xcd, apps.wsh_delivery_details wdd
                                WHERE  xcd.order_no = oh.order_number
                                AND    xcd.delivery_detail_id = wdd.delivery_detail_id
                                AND    wdd.pickable_flag = 'Y'
                                AND    wdd.source_line_id = ol.line_id))
                       --AND    nvl(p_process_type, 'A') != 'S'
                       )
               GROUP  BY order_number,
                         customer_name,
                         trx_type,
                         CATEGORY,
                         CONTAINER,
                         shipping_instructions,
                         part_number,
                         truck
               UNION ALL
               SELECT NULL "cont_name",
                      msi.description description_sup,
                      'BUYOUT' "header_desc",
                      oh.order_number sales_order,
                      NULL "ship_set_name",
                      rc.customer_name,
                      mp.organization_code plant_code_sup,
                      NULL "category",
                      NULL "transaction_type",
                      NVL(ROUND(ol.ordered_quantity * msi.unit_weight, 3), 0) "gross_weight",
                      NVL(ol.ordered_quantity, 0) quantity_ordered_sup,
                      NULL "truck",
                      oh.attribute1 project_name,
                      oh.cust_po_number,
                      mp.organization_code plant_info_sup,
                      NVL(DECODE(ol.flow_status_code, 'SHIPPED', ol.ordered_quantity, 'CLOSED', ol.ordered_quantity, 0),
                          0) quantity_picked,
                      NVL(DECODE(ol.flow_status_code, 'SHIPPED', 0, 'CLOSED', 0, ol.ordered_quantity), 0) backordered_quantity,
                      NVL(ROUND(ol.ordered_quantity * msi.unit_weight, 3), 0) extended_wt_sup,
                      msi.segment1 part_number_sup,
                      NULL staged_truck_id
               FROM   inv.mtl_system_items_b              msi,
                      inv.mtl_parameters                  mp,
                      apps.oe_order_headers               oh,
                      apps.oe_order_lines                 ol,
                      apps.xxar_customers_v               rc,
                      xxbm_order_truck_activity xta
               WHERE  xta.order_number = oh.order_number
               AND    ol.header_id = oh.header_id
               AND    ol.ship_from_org_id = msi.organization_id
               AND    ol.inventory_item_id = msi.inventory_item_id
               AND    ol.ship_from_org_id = mp.organization_id
               AND    msi.item_type NOT IN ('PR', 'FRT', 'CR') -- don't include pricing items, freight, or crating charges
              AND    ol.flow_status_code <> 'CANCELLED'
              AND    ol.source_type_code = 'EXTERNAL'
              AND    rc.customer_id = oh.sold_to_org_id
              AND    NVL(p_process_type, 'A') != 'S'
              AND    ol.ship_from_org_id IN
                     (SELECT organization_id FROM inv.mtl_parameters WHERE calendar_code <> 'BUTLER MFG')
                    --AND    oh.order_number = p_order_number --1501720502
              AND    (mp.organization_code = p_org OR ol.shipping_instructions LIKE '%' || p_org)) shpp
      WHERE  1 = 1
      ORDER  BY SUBSTR(cont_name,
                       INSTR(TRANSLATE(UPPER(cont_name), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '--------------------------'),
                             '-')),
                TO_NUMBER(TRIM(DECODE(TRANSLATE(UPPER(cont_name),
                                                'ABCDEFGHIJKLMNOPQRSTUVWXYZ0132456789 ',
                                                '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^'),
                                      RPAD('^', LENGTH(cont_name), '^'),
                                      SUBSTR(cont_name,
                                             1,
                                             INSTR(TRANSLATE(UPPER(cont_name),
                                                             'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                                                             '--------------------------'),
                                                   '-') - 1),
                                      0)));

    --changes start - abhallam
    w_org              NUMBER := LENGTH(p_org);
    w_order_number     NUMBER := LENGTH(p_order_number);
    w_truck_name       NUMBER := LENGTH(p_truck_name);
    w_process_type     NUMBER := LENGTH(p_process_type);
    w_single_point_org NUMBER := LENGTH(p_single_point_org);
    w_promise_date     NUMBER := LENGTH(p_promise_date);
    l_p_date           DATE;
    l_prc              VARCHAR2(100) := 'xxbbna_loading_shipping_proc_m';
    l_user_id          fnd_user.user_id%TYPE;
    l_resp_id          fnd_responsibility_tl.responsibility_id%TYPE;
    l_resp_appl_id     fnd_responsibility_tl.application_id%TYPE;
    --changes end - abhallam

    l_promise_date VARCHAR2(20) := REPLACE(p_promise_date, CHR(63));

  BEGIN
    v_truck_name := p_truck_name;

    --changes start - abhallam
    --log ( l_prc,'START. lv_org_id='||lv_org_id);
    /*
    IF fnd_global.user_id < 0 THEN
        mo_global.set_policy_context('S', xxbbna_get_operating_unit_id(p_org));
    END IF;
    */

    /* log( l_prc,'0  p_org=' || p_org || ', p_order_number=' || p_order_number || ', p_truck_name=' || p_truck_name
         || ', p_process_type=' || p_process_type || ', p_single_point_org=' || p_single_point_org
         || ', p_promise_date=' || p_promise_date
        );

    log( l_prc,'1  w_org='         || w_org
        || ', w_order_number='     || w_order_number
        || ', w_truck_name='       || w_truck_name
        || ', w_process_type='     || w_process_type
        || ', w_single_point_org=' || w_single_point_org
        || ', w_promise_date='     || w_promise_date);*/

    w_promise_date := LENGTH(l_promise_date);
    --log( l_prc,'1-1  w_promise_date_trim=' || w_promise_date);

    BEGIN
      SELECT user_id INTO l_user_id FROM fnd_user WHERE user_name = 'SYSADMIN';
    EXCEPTION
      WHEN others THEN
        l_user_id := 0; --SYSADMIN
    END;
    --log( l_prc,'1-2 l_user_id=' || l_user_id);

    BEGIN
      SELECT responsibility_id, application_id
      INTO   l_resp_id, l_resp_appl_id
      FROM   fnd_responsibility_tl
      WHERE  responsibility_name = 'BSNA Shipping' --'BSCN Order Management Super User - SJG' --'BSNA Shipping'
      AND    language = 'US';
    EXCEPTION
      WHEN others THEN
        l_resp_id      := 50438; --'BSNA Shipping'
        l_resp_appl_id := 665;
    END;
    --log( l_prc,'1-3 l_resp_id=' || l_resp_id || ', l_resp_appl_id=' || l_resp_appl_id);

    BEGIN
      --          fnd_global.APPS_INITIALIZE(user_id      => l_user_id,
      --                                     resp_id      => l_resp_id,
      --                                     resp_appl_id => l_resp_appl_id);
      mo_global.set_policy_context('S', lv_org_id);
    END;

    /*
    begin
    fnd_global.APPS_INITIALIZE(user_id=>61269, --l_user_id,
                               resp_id=>52544, --l_resp_id,
                               resp_appl_id=>660); --l_resp_appl_id);
    mo_global.set_policy_context('S',41);
    end;
              */

    --log( l_prc,'1-4 after apps_initialize');

    --changes end - abhallam

    --
    -- Based on p_process_type = Truck pull the data  --Truck data should be there for process_type = T or O or S
    --
    BEGIN
      INSERT INTO xxbm_order_truck_activity
        (order_number, last_activity, truck_name)
        SELECT a.*
        FROM   (SELECT xcl.order_no order_number,
                       MAX(NVL(xcl.last_update_date, xcl.creation_date)) last_activity,
                       v_truck_name truck_name
                FROM   xxwsh_container_loading xcl
                WHERE  v_truck_name IS NOT NULL
                AND    v_truck_name IN (xcl.truck_id_1, xcl.truck_id_2, xcl.staged_truck_id)
                GROUP  BY xcl.order_no
                ORDER  BY last_activity DESC) a
        WHERE  1 = 1;
    END;

    --
    -- Based on p_process_type = Order pull the data
    --
    IF (p_process_type = 'O') THEN
      BEGIN

        SELECT COUNT(1) INTO v_count FROM xxbm_order_truck_activity WHERE order_number = p_order_number;

        IF v_count = 0 THEN
          INSERT INTO xxbm_order_truck_activity
            (order_number, last_activity, truck_name)
            (SELECT p_order_number order_number, SYSDATE last_activity, v_truck_name
             FROM   dual
             WHERE  p_order_number IS NOT NULL);
        END IF;
      END;

      --
      -- Based on p_process_type = Single-point org pull the data
      --
    ELSIF (p_process_type = 'S') THEN

      --log( l_prc,'2 - in p_direct_load = N');

      BEGIN
        INSERT INTO xxbm_order_truck_activity
          (order_number, last_activity, truck_name)
          SELECT oh.order_number, NULL, NULL
          FROM   ont.oe_order_headers_all oh
          WHERE  oh.open_flag = 'Y'
          AND    oh.org_id = lv_org_id
          AND    oh.flow_status_code = 'BOOKED'
          AND    NOT EXISTS
           (SELECT NULL FROM xxbm_order_truck_activity xo WHERE xo.order_number = oh.order_number)
          AND    EXISTS
           (SELECT NULL
                  FROM   wsh.wsh_delivery_details wdd
                  WHERE  wdd.org_id = oh.org_id
                  AND    wdd.source_header_id = oh.header_id
                  AND    wdd.customer_id = oh.sold_to_org_id
                  AND    wdd.pickable_flag = 'Y'
                        --AND    wdd.released_status in ('B','R','S')
                  AND    wdd.released_status = 'Y'
                        -- AND    nvl(wdd.picked_quantity, 0) = 0
                  AND    NVL(wdd.picked_quantity, 0) > 0
                  AND    EXISTS (SELECT NULL
                          FROM   ont.oe_order_lines_all ol
                          WHERE  ol.header_id = wdd.source_header_id
                          AND    ol.line_id = wdd.source_line_id
                          AND    ol.org_id = oh.org_id
                          AND    TRUNC(ol.promise_date) = TRUNC(TO_DATE(l_promise_date, 'MM/DD/YYYY'))
                          AND    ol.flow_status_code != 'CLOSED'
                          AND    ol.flow_status_code != 'CANCELLED'
                          AND    ol.shipping_instructions = p_single_point_org))
          UNION
          SELECT DISTINCT oh.order_number, NULL, NULL
          FROM   ont.oe_order_headers_all        oh,
                 apps.po_requisition_headers_all prh,
                 apps.po_requisition_lines_all   prl,
                 apps.oe_po_requisition_lines_v  v,
                 apps.oe_order_lines_all         ol
          WHERE  1 = 1
          AND    oh.flow_status_code = 'BOOKED'
          AND    oh.header_id = ol.header_id
          AND    ol.flow_status_code != 'CLOSED'
          AND    ol.flow_status_code != 'CANCELLED'
          AND    ol.org_id = oh.org_id
          AND    TRUNC(ol.promise_date) = TRUNC(TO_DATE(l_promise_date, 'MM/DD/YYYY'))
          AND    prh.requisition_header_id = prl.requisition_header_id
          AND    prh.requisition_header_id = oh.source_document_id
          AND    prh.type_lookup_code IN ( 'INTERNAL', 'PURCHASE' ) --KMM 10/09/19
          AND    prl.requisition_line_id = v.requisition_line_id
          AND    v.from_loc = SUBSTR(p_single_point_org, 1, 3)
          AND    v.to_loc = SUBSTR(p_single_point_org, 5, 3)
          AND    oh.open_flag = 'Y'
          AND    oh.org_id = lv_org_id
          AND    oh.flow_status_code = 'BOOKED'
          AND    NOT EXISTS
           (SELECT NULL FROM xxbm_order_truck_activity xo WHERE xo.order_number = oh.order_number)
          AND    EXISTS (SELECT NULL
                  FROM   wsh.wsh_delivery_details wdd
                  WHERE  wdd.org_id = oh.org_id
                  AND    wdd.source_header_id = oh.header_id
                  AND    wdd.customer_id = oh.sold_to_org_id
                  AND    wdd.pickable_flag = 'Y'
                  AND    wdd.released_status = 'Y'
                  AND    NVL(wdd.picked_quantity, 0) > 0);

        --log( l_prc,'3 - after insert. released_status = B,R,S rowcount = ' || sql%rowcount);
      END;

    END IF;

    --
    -- Load the data into out variable via cursor cur_orderd_det
    --
    OPEN cur_orderd_det(p_org, p_single_point_org, l_promise_date);

    FETCH cur_orderd_det BULK COLLECT
      INTO l_order_details;

    CLOSE cur_orderd_det;

    --log(l_prc,'END - l_order_details.count = ' || l_order_details.count);

    p_order_details := l_order_details;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line(sqlerrm);
      --log(l_prc,'END Error' || sqlerrm);
  END xxbbna_loading_shipping_proc_m;`,
  );
  return result;
}

export async function createOperatingInvIDFunc() {
  const result = await connection.execute(`
    CREATE OR REPLACE FUNCTION xxbbna_get_operating_inv_id(p_org_code VARCHAR2) RETURN NUMBER
    AS
    x_org_inv_id NUMBER := 0;
    BEGIN
      SELECT x.organization_id
      INTO   x_org_inv_id
      FROM   mtl_parameters x
      WHERE  organization_code = p_org_code;

    RETURN x_org_inv_id;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('Exception ------ ' || sqlerrm);
      RETURN x_org_inv_id;
  END xxbbna_get_operating_inv_id;`);
  return result;
}

export async function createCustomTruckIDProc() {
  const connection = await pool.getConnection();
  const result = await connection.execute(`
    CREATE OR REPLACE FUNCTION xxcustom_get_truck_id(p_order_number NUMBER, p_cont_name VARCHAR2, p_ship_from_org_code VARCHAR2, p_org VARCHAR2, p_ship_set_name VARCHAR2)
    RETURN VARCHAR2
    AS
    BEGIN
      RETURN NULL;
    END;`);
  return result;
}

export async function createCustomGetDesc() {
  const connection = await pool.getConnection();
  const result = await connection.execute(`
    CREATE OR REPLACE FUNCTION xxcustom_get_desc(p_order_number NUMBER, p_cont_name VARCHAR2)
    RETURN VARCHAR 2
    AS 
    BEGIN
      RETURN NULL;
    END;`);
  return result;
}

export async function createVerifyOrderFunc() {
  const connection = await pool.getConnection();
  const result = await connection.execute(`
    CREATE OR REPLACE FUNCTION xxbbna_warehouse_valid_order(p_org_code IN VARCHAR2, p_order_number IN NUMBER) RETURN VARCHAR2 AS l_is_valid VARCHAR2(1); v_ishold_exists VARCHAR2(1) := 'U';
    BEGIN
    l_is_valid := 'N';

    SELECT 'Y'
    INTO   l_is_valid
    FROM   (SELECT 'Y'
            FROM   oe_order_headers_all oh, mtl_parameters mtl
            WHERE  1 = 1
            AND    oh.org_id = mtl.organization_id
            AND    oh.order_number = p_order_number
            AND    mtl.organization_code = p_org_code
            UNION
            SELECT DISTINCT 'Y'
            FROM   xxwsh_container_loading
            WHERE  order_no = p_order_number
            AND    ship_from_org_code = p_org_code);

    IF l_is_valid = 'Y' THEN
      v_ishold_exists := xxcustom_order_credit_check(p_order_number, p_org_code);       

    IF v_ishold_exists = 'Y' THEN
        l_is_valid := 'H';
      ELSE
        l_is_valid := 'U';
      END IF;
    END IF;

    RETURN l_is_valid;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('Exception ------ ' || sqlerrm);
      RETURN l_is_valid;
  END xxbbna_warehouse_valid_order;

    `);
  return result;
}

export async function createOrderCreditCheckFunc() {
  const connection = await pool.getConnection();
  const result = await connection.execute(`
    CREATE OR REPLACE FUNCTION xxcustom_order_credit_check(p_order_no IN NUMBER, p_organization_code IN VARCHAR2)
    RETURN VARCHAR2 
    AS 
    v_count NUMBER;
    v_ishold_exists VARCHAR2(1) := 'N';
    v_single_point  NUMBER;
    v_direct        NUMBER; 

    BEGIN
    IF fnd_global.user_id < 0 THEN
      mo_global.set_policy_context('S', xxbbna_get_operating_unit_id(p_organization_code));
    END IF;

    BEGIN
      SELECT COUNT(*)
      INTO   v_count
      FROM   oe_order_holds           h, --AK PR00100 - R12 Upgrade
             oe_hold_sources          hs, --AK PR00100 - R12 Upgrade
             apps.oe_hold_definitions hd,
             oe_order_headers         oh --AK PR00100 - R12 Upgrade
      WHERE  h.released_flag = 'N'
      AND    hs.hold_source_id = h.hold_source_id
      AND    hd.hold_id = hs.hold_id
      AND    h.line_id IS NULL
      AND    h.header_id = oh.header_id
      AND    hd.type_code IN ('STOP', 'CREDIT')
      AND    oh.order_number = p_order_no;

      IF (v_count > 0) THEN
        --RETURN('Y');
        v_ishold_exists := 'Y';
      ELSE
        v_ishold_exists := 'N';
      END IF;
    EXCEPTION
      WHEN no_data_found THEN
        v_ishold_exists := 'N';
      WHEN others THEN
        v_ishold_exists := 'N';
    END;

    IF v_ishold_exists = 'N' THEN
      BEGIN
        SELECT COUNT(*)
        INTO   v_count
        FROM   oe_order_headers    oh, --AK PR00100 - R12 Upgrade
               oe_order_holds      h, --AK PR00100 - R12 Upgrade
               oe_hold_sources     hs, --AK PR00100 - R12 Upgrade
               apps.oe_hold_definitions hd
        WHERE  oh.header_id = h.header_id
        AND    h.released_flag = 'N'
        AND    hs.hold_source_id = h.hold_source_id
        AND    hd.name IN ('SHIPPING HOLD', 'CHANGE ORDER')
        AND    hd.hold_id = hs.hold_id
        AND    oh.order_number = p_order_no;

        IF (v_count > 0) THEN
          SELECT COUNT(1)
          INTO   v_single_point
          FROM   xxwsh_containers xc
          WHERE  xc.order_no = p_order_no
          AND    xc.ship_from_org_code = p_organization_code
          AND    xc.ship_set_name IS NOT NULL;

          SELECT COUNT(1)
          INTO   v_direct
          FROM   xxwsh_containers xc
          WHERE  xc.order_no = p_order_no
          AND    ((xc.ship_from_org_code = p_organization_code AND xc.ship_set_name IS NULL) OR
                (xc.ship_set_name LIKE '%' || p_organization_code));

          IF (v_single_point > 0 AND v_direct = 0) THEN
            v_ishold_exists := 'N'; -- allow single point leg while on hold but not direct
          ELSE
            v_ishold_exists := 'Y';
          END IF;
          --RETURN('Y');
        ELSE
          v_ishold_exists := 'N';
          --RETURN('N');
        END IF;
      EXCEPTION
        WHEN no_data_found THEN
          v_ishold_exists := 'N';
        WHEN others THEN
          v_ishold_exists := 'N';
      END;
    END IF;

    RETURN v_ishold_exists;
  END xxcustom_order_credit_check;
    `);
  return result;
}

export async function createGetOrgIDFunc() {
  const connection = await pool.getConnection();
  const result = await connection.execute(`
    CREATE OR REPLACE FUNCTION xxbbna_get_operating_unit_id(p_org_code IN VARCHAR2)
    RETURN NUMBER AS
    x_org_id NUMBER := 0;
    BEGIN
    SELECT organization_id INTO x_org_id FROM mtl_parameters WHERE organization_code = p_org_code;

    RETURN x_org_id;
  EXCEPTION
    WHEN others THEN
      dbms_output.put_line('Exception ------ ' || sqlerrm);
      RETURN x_org_id;
  END xxbbna_get_operating_unit_id;
  `);
  return result;
}
