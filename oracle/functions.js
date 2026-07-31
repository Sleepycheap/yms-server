import * as type from "./types.js";

// Global table type declaration for different output
/*
This function takes an array of objects, and returns the scactable object created from this array
g_scac_records to add to scactable
const scacRecords = [
  {
    scac_code: "AJT",
    carrier_name: "Alpha John Trucks",
  },
  {
    scac_code: "TSR",
    carrier_name: "Transportation Services",
  },
];

function scactableFactory(scacRecords) {
  //This maps each record from scacReords to an object in scactable
  const scactable = scacRecords.map((record) =>
    g_scac_recordFactory(record.scac_code, record.carrier_name),
  );
  return scactable;
}

would return scactable, which can then be accessed by calling the function and assigning to a variable

const scactable = scactableFactory(scacRecords)

console.log(scactable) returns

[
  { scac_code: 'AJT', carrier_name: 'Alpha John Trucks' },
  { scac_code: 'TSR', carrier_name: 'Transportation Services' }
]

function updateScacTable({ scac_code: scac_code, carrier_name: carrier_name }) {
  scacRecords.push({
    scac_code,
    carrier_name,
  });
  return createScacTable(scacRecords);
}

*/
///
// Creates scactable
function scactableFactory(scacRecords) {
  const scactable = scacRecords.map((record) =>
    type.g_scac_recordFactory(record.scac_code, record.carrier_name),
  );
  return scactable;
}

function orgtableFactory(orgRecords) {
  const orgtable = orgRecords.map((record) =>
    type.g_org_recordFactory(record.org_code),
  );
  return orgtable;
}

function trucktableFactory(truckRecords) {
  const trucktable = truckRecords.map((record) =>
    type.g_truck_recordFactory(record.truck_id),
  );
  return trucktable;
}

function g_shipping_order_details_rec_tableFactory(shippingOrderDetails) {
  const g_shipping_order_details_tbl = shippingOrderDetails.map((record) =>
    type.g_shipping_order_details_recFactory(
      record.sequence_no,
      record.cont_name,
      record.linedescription,
      record.header_desc,
      record.order_number,
      record.ship_set_name,
      record.customer_name,
      record.ship_from_org_code,
      record.category,
      record.transaction_type,
      record.gross_weight,
      record.requested_quantity,
      record.project_name,
      record.cust_po_number,
      record.plant_info_sup,
      record.quantity_picked,
      record.backordered_quantity,
      record.extended_wt_sup,
      record.part_number_sup,
      record.staged_truck_id,
    ),
  );
  return g_shipping_order_details_tbl;
}

/*
table functions that create multiple rows will return an array of objects that looks like this

[
  {
    sequence_no: 123456789,
    cont_name: '1AT',
    linedescription: '4ftgr',
    header_desc: 'N/A',
    order_number: 260014145,
    ship_set_name: 'direct',
    customer_name: 'Bluescope',
    ship_from_org_code: 'ANN',
    category: undefined,
    transaction_type: 'purchased',
    gross_weight: 8000,
    requested_quantity: 20,
    truck: 'TEST',
    project_name: '123f344as3f',
    cust_po_number: 'Charles Beef',
    plant_info_sup: 20,
    quantity_picked: 0,
    backordered_quantity: undefined,
    extended_wt_sup: '234fef',
    part_number_sup: '2349234805t1',
    staged_truck_id: undefined
  },
  {
    sequence_no: 22319784,
    cont_name: '30M',
    linedescription: '12313sf',
    header_desc: 'N/A',
    order_number: 194567951,
    ship_set_name: 'direct',
    customer_name: 'ACME',
    ship_from_org_code: 'STJ',
    category: undefined,
    transaction_type: 'sold',
    gross_weight: 20000,
    requested_quantity: 300,
    truck: 'TEST2',
    project_name: '234asdf44as3f',
    cust_po_number: 'John Stamos',
    plant_info_sup: 300,
    quantity_picked: 2,
    backordered_quantity: undefined,
    extended_wt_sup: '23490sdg',
    part_number_sup: '44198911231T1',
    staged_truck_id: undefined
  }
]

*/ ////////////////////
function g_shipping_order_details_tbl_pFactory(shippingOrderDetails) {
  const g_shipping_order_details_tbl_p = shippingOrderDetails.map((record) =>
    type.g_shipping_order_details_rec_pFactory(
      record.sequence_no,
      record.cont_name,
      record.linedescription,
      record.header_desc,
      record.order_number,
      record.ship_set_name,
      record.customer_name,
      record.ship_from_org_code,
      record.category,
      record.transaction_type,
      record.gross_weight,
      record.requested_quantity,
      record.project_name,
      record.cust_po_number,
      record.plant_info_sup,
      record.quantity_picked,
      record.backordered_quantity,
      record.extended_wt_sup,
      record.part_number_sup,
      record.staged_truck_id,
    ),
  );
  return g_shipping_order_details_tbl_p;
}

function g_loaded_truck_detailsFactory(loadedTrucksDetails) {
  const g_loaded_trucks_details_tbl = loadedTrucksDetails.map((record) =>
    type.g_loaded_trucks_details_recFactory(
      record.sequence_no,
      record.cont_name,
      record.linedescription,
      record.header_desc,
      record.order_number,
      record.ship_set_name,
      record.customer_name,
      record.ship_from_org_code,
      record.category,
      record.transaction_type,
      record.gross_weight,
      record.requested_quantity,
      record.project_name,
      record.cust_po_number,
      record.plant_info_sup,
      record.quantity_picked,
      record.backordered_quantity,
      record.extended_wt_sup,
      record.part_number_sup,
      record.staged_truck_id,
    ),
  );
  return g_loaded_trucks_details_tbl;
}

function g_truck_manifest_tblFactory(truckManifestDetails) {
  const g_truck_manifest_tbl = truckManifestDetails.map((record) =>
    type.g_truck_manifest_recFactory(
      record.organization,
      record.description,
      record.container_name,
      record.truck,
      record.ordered_qty,
      record.extended_wt,
      record.order_number,
    ),
  );
  return g_truck_manifest_tbl;
}

function truckimgtableFactory(truckImages) {
  const truckimgtable = truckimages.map((record) =>
    type.g_truck_img_recordFactory(
      record.truck_id,
      record.user_id,
      record.truck_image,
    ),
  );
  return truckimgtable;
}

function truckimgtableFactory(truckImages) {
  const truckimgtable = truckimages.map((record) =>
    type.g_truck_img_recordFactory(
      record.truck_id,
      record.user_id,
      record.truck_image,
    ),
  );
  return truckimgtable;
}

function questions_tableFactory(questions) {
  const questions_table = questions.map((question) =>
    type.g_questions_recordFactory(
      question.category_id,
      question.category_type,
      question.question,
    ),
  );
  return questions_table;
}

function answers_tableFactory(answers) {
  const answers_table = answers.map((answers) =>
    type.g_answers_recordFactory(
      answers.category_id,
      answers.category_type,
      answers.answers,
    ),
  );
  return answers_table;
}

function product_type_tableFactory(productTypes) {
  const product_type_table = productTypes.map((product) =>
    type.g_cat_product_type_rel_recordFactory(
      product.category_prd_type_rel_id,
      product.category,
      product.product_type_id,
    ),
  );
  return product_type_table;
}

function product_type_questions_tableFactory(productTypeQuestions) {
  const product_type__questions_table = productTypesQuestions.map(
    (productQuestion) =>
      type.g_product_type_question_recordFactory(
        productQuestion.product_type_ques_id,
        productQuestion.product_type_id,
        productQuestion.question,
      ),
  );
  return product_type_table;
}

function product_type_answers_tableFactory(productTypeAnswers) {
  const product_type_answers_table = productTypesAnswers.map((productAnswer) =>
    type.g_product_type_question_recordFactory(
      productAnswer.product_type_answer_id,
      productAnswer.product_ques_id,
      productAnswer.answers,
    ),
  );
  return product_type_answers_table;
}

function g_load_verification_tbl_Factory(loadVerifications) {
  const g_load_verification_tbl = loadVerifications.map((load) =>
    type.g_product_type_question_recordFactory(
      load.product_type_answer_id,
      load.answer_flag,
    ),
  );
  return g_load_verification_tbl;
}

// const answers_table = [g_answers_record]
// INDEX BY BINARY_INTEGER;*/
// const product_type_table = [g_product_type_record];
// INDEX BY BINARY_INTEGER;

// const category_product_type_table = [g_cat_product_type_rel_record];
// INDEX BY BINARY_INTEGER;
// const product_type_answers_table = [g_product_type_question_record];
// INDEX BY BINARY_INTEGER;

// const product_type_answers_table = [g_product_type_answers_record];
// INDEX BY BINARY_INTEGER;

// const g_load_verification_tbl = [g_load_verification_record];
// INDEX BY BINARY_INTEGER;

// const ld_txn_question_table = [g_ld_txn_question_record];
// INDEX BY BINARY_INTEGER;

// const ld_txn_answer_table = [g_ld_txn_answer_record];
// INDEX BY BINARY_INTEGER;

// For Singple Point org
// const orglist = [g_org_list_record];
// INDEX BY BINARY_INTEGER;

// For Environment details
// const ipaddr = [g_ip_addr_record];
// INDEX BY BINARY_INTEGER;

// For YMS App Version Details
// const appversion = [g_app_version_record];
// INDEX BY BINARY_INTEGER;
