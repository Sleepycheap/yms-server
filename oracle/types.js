/*
Factory functions used to replicate TYPE declaration in PCK file. The factory function returns an Object based on the structure

function g_truck_manifest_recFactory(
  organization,
  description,
  container_name,
  truck,
  ordered_qty,
  extended_wt,
  order_number,
) {
  return {
    organization, // VARCHAR2(3),
    description, // VARCHAR2(240),
    container_name, // VARCHAR2(100),
    truck, // VARCHAR2(100),
    ordered_qty,
    extended_wt,
    order_number,
  };
}

// To use the factory function, you instantiate a new instance of the object. In this case, a truck_manifest object
let truck_manifest = g_truck_manifest_recFactory(
  "ANN",
  "1 FG Rafter",
  "1AT",
  "260049114T1",
  "20",
  "2000",
  "260049114",
);


example of the object created by factory function
the truck manifest object returned from this function would be:
{
  organization: 'ANN',
  description: '1 FG Rafter',
  container_name: '1AT',
  truck: '260049114T1',
  ordered_qty: '20',
  extended_wt: '2000',
  order_number: '260049114'
}

*/

// RETURNS g_scac_record Object
export function g_scac_recordFactory(scac_code, carrier_name) {
  return {
    scac_code,
    carrier_name,
  };
}

// RETURNS g_org_record
export function g_org_recordFactory(org_code) {
  return {
    org_code, //mtl_parameters.organization_code % YPE,
  };
}

export function g_truck_recordFactory(truck_id) {
  return {
    truck_id, //xxwsh_shippable_trucks_v2.truck_id % YPE,
  };
}

export function g_questions_recordFactory(
  category_id,
  category_type,
  question,
) {
  return {
    category_id,
    category_type,
    question,
  };
}

export function g_answers_recordFactory(
  category_answer_id,
  category_id,
  answers,
) {
  return {
    category_answer_id,
    category_id,
    answers,
  };
}

export function g_shipping_order_details_recFactory(
  sequence_no,
  cont_name,
  linedescription,
  header_desc,
  order_number,
  ship_set_name,
  customer_name,
  ship_from_org_code,
  category,
  transaction_type,
  gross_weight,
  requested_quantity,
  truck,
  project_name,
  cust_po_number,
  plant_info_sup,
  quantity_picked,
  backordered_quantity,
  extended_wt_sup,
  part_number_sup,
  staged_truck_id,
) {
  return {
    sequence_no,
    cont_name, //100 char limit
    linedescription, // 250 limit
    header_desc, //            'VARCHAR2(100)',
    order_number,
    ship_set_name, //          'VARCHAR2(100)',
    customer_name, //          'VARCHAR2(100)',
    ship_from_org_code, //     VARCHAR2(10),
    CATEGORY, //               VARCHAR2(100),
    transaction_type, //       VARCHAR2(100),
    gross_weight,
    requested_quantity,
    truck, //                  VARCHAR2(100),
    project_name, //           VARCHAR2(240),
    cust_po_number, //        VARCHAR2(50),
    plant_info_sup, //         VARCHAR2(3),
    quantity_picked,
    backordered_quantity,
    extended_wt_sup,
    part_number_sup, // VARCHAR2(40),
    staged_truck_id, // VARCHAR2(20)
  };
}

export function g_shipping_order_details_rec_pFactory(
  sequence_no,
  cont_name,
  linedescription,
  header_desc,
  order_number,
  ship_set_name,
  customer_name,
  ship_from_org_code,
  category,
  transaction_type,
  gross_weight,
  requested_quantity,
  truck,
  project_name,
  cust_po_number,
  plant_info_sup,
  quantity_picked,
  backordered_quantity,
  extended_wt_sup,
  part_number_sup,
) {
  return {
    sequence_no,
    cont_name, // VARCHAR2(100),
    linedescription, // VARCHAR2(240),
    header_desc, // VARCHAR2(100),
    order_number,
    ship_set_name, // VARCHAR2(100),
    customer_name, // VARCHAR2(100),
    ship_from_org_code, // VARCHAR2(10),
    CATEGORY, // VARCHAR2(100),
    transaction_type, // VARCHAR2(100),
    gross_weight,
    requested_quantity,
    truck, // VARCHAR2(100),
    project_name, // VARCHAR2(240),
    cust_po_number, // VARCHAR2(50),
    plant_info_sup, // VARCHAR2(3),
    quantity_picked,
    backordered_quantity,
    extended_wt_sup,
    part_number_sup, // VARCHAR2(40)
  };
}

export function g_loaded_truck_details_recFactory(
  cont_name,
  linedescription,
  header_desc,
  order_number,
  ship_set_name,
  customer_name,
  ship_from_org_code,
  category,
  transaction_type,
  gross_weight,
  requested_quantity,
  truck,
) {
  return {
    cont_name, // VARCHAR2(100),
    linedescription, // VARCHAR2(240),
    header_desc, // VARCHAR2(100),
    order_number,
    ship_set_name, // VARCHAR2(100),
    customer_name, // VARCHAR2(100),
    ship_from_org_code, // VARCHAR2(10),
    CATEGORY, // VARCHAR2(100),
    transaction_type, // VARCHAR2(100),
    gross_weight,
    requested_quantity,
    truck, // VARCHAR2(100)
  };
}

export function g_truck_manifest_recFactory(
  organization,
  description,
  container_name,
  truck,
  ordered_qty,
  extended_wt,
  order_number,
) {
  return {
    organization, // VARCHAR2(3),
    description, // VARCHAR2(240),
    container_name, // VARCHAR2(100),
    truck, // VARCHAR2(100),
    ordered_qty,
    extended_wt,
    order_number,
  };
}

export function g_truck_img_recordFactory(truck_id, user_id, truck_image) {
  return {
    truck_id, //INTERFACE.xxbbna_truck_image.truck_id % TYPE",
    user_id, //INTERFACE.xxbbna_truck_image.created_by % TYPE",
    truck_image, //INTERFACE.xxbbna_truck_image.truck_image % TYPE",
  };
}

export function g_product_type_recordFactory(product_type_id, product_type) {
  return {
    product_type_id, //interface.XXBM_TRKLOADVER_PRD_TYPE.product_type_id % TYPE",
    product_type, //interface.XXBM_TRKLOADVER_PRD_TYPE.product_type % TYPR",
  };
}

export function g_cat_product_type_rel_recordFactory(
  category_prd_type_rel_id,
  category,
  product_type_id,
) {
  return {
    category_prd_type_rel_id, //interface.XXBM_TRKLOADVER_CAT_TYPE.category_prd_type_rel_id % TYPE",
    category, //interface.XXBM_TRKLOADVER_CAT_TYPE.category % TYPE",
    product_type_id, //interface.XXBM_TRKLOADVER_CAT_TYPE.product_type_id % TYPE",
  };
}

export function g_product_type_question_recordFactory(
  product_type_ques_id,
  product_type_id,
  question,
) {
  return {
    product_type_ques_id, //interface.XXBM_TRKLOADVER_PRD_TYPE_QN.product_type_ques_id % TYPE",
    product_type_id, //interface.XXBM_TRKLOADVER_PRD_TYPE_QN.product_type_id % TYPE",
    question, //interface.XXBM_TRKLOADVER_PRD_TYPE_QN.question % TYPE",
  };
}

export function g_product_type_answers_recordFactory(
  product_type_answer_id,
  product_type_ques_id,
  answers,
) {
  return {
    product_type_answer_id, //interface.XXBM_TRKLOADVER_PRD_TYPE_ANS.product_type_answer_id % TYPE",
    product_type_ques_id, //interface.XXBM_TRKLOADVER_PRD_TYPE_ANS.product_type_ques_id % TYPE",
    answers, //interface.XXBM_TRKLOADVER_PRD_TYPE_ANS.answers % TYPE",
  };
}

export function g_load_verification_recordFactory(
  product_type_answer_id,
  answer_flag,
) {
  return {
    product_type_answer_id, //interface.XXBM_TRKLOADVER_TXN_DET.product_type_answer_id % TYPE",
    answer_flag, //INTERFACE.XXBM_TRKLOADVER_TXN_DET.answer_flag % TYPE,
  };
}

// Load TXN Question REC

export function g_ld_txn_question_recordFactory(
  product_type_ques_id,
  product_type_id,
  product_type,
  question,
  additional_comments,
  transaction_id,
) {
  return {
    product_type_ques_id, //interface.XXBM_TRKLOADVER_PRD_TYPE_QN.product_type_ques_id % type",
    product_type_id, //interface.XXBM_TRKLOADVER_PRD_TYPE_QN.product_type_id % type",
    product_type, //interface.XXBM_TRKLOADVER_PRD_TYPE.product_type % type",
    question, //interface.XXBM_TRKLOADVER_PRD_TYPE_QN.question % type",
    additional_comments, //interface.XXBM_TRKLOADVER_TXN.additional_comments % type",
    transaction_id, //interface.XXBM_TRKLOADVER_TXN.transaction_id % type",
  };
}

// Load TXN Answer REC
export function g_ld_txn_answer_recordFactory(
  answer_flag,
  answers,
  product_type_ques_id,
  product_type_answer_id,
  transaction_detail_id,
) {
  return {
    answer_flag, //interface.XXBM_TRKLOADVER_TXN_DET.answer_flag % type",
    answers, //interface.XXBM_TRKLOADVER_PRD_TYPE_ANS.answers % type",
    product_type_ques_id, //interface.XXBM_TRKLOADVER_PRD_TYPE_QN.product_type_ques_id % type",
    product_type_answer_id, //interface.XXBM_TRKLOADVER_TXN_DET.PRODUCT_TYPE_ANSWER_ID % type",
    transaction_detail_id, //interface.XXBM_TRKLOADVER_TXN_DET.transaction_detail_id % type",
  };
}

// For Environment IP Details
export function g_ip_addr_recordFactory(ip_name, ip_addr) {
  return {
    ip_name, //fnd_lookup_values.meaning % TYPE,
    ip_addr, //fnd_lookup_values.description % TYPE,
  };
}

// For Single Point Org List
export function g_org_list_recordFactory(org_list, tag_list) {
  return {
    org_list, //fnd_lookup_values.meaning % TYPE,
    tag_list, //fnd_lookup_values.tag % TYPE,
  };
}

// For YMS App Version Details
export function g_app_version_recordFactory(app_version, app_mode) {
  return {
    app_version, //fnd_lookup_values.meaning % TYPE,
    app_mode, //fnd_lookup_values.description % TYPE,
  };
}
