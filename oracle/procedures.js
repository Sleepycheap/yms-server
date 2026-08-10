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
