import sql from "sql-template-tag";
import { pool } from "./pool.js";

const connection = await pool.getConnection();

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
