import { execute } from "../sqlTest.js";

export function CategoryProductRelObj(
  categoryProductRelID,
  category,
  productTypeId,
) {
  return {
    categoryProductRelID,
    category,
    productTypeId,
  };
}
// const s = `CREATE TABLE IF NOT EXISTS CategoryProductRel(categoryProductRelID INTEGER, category TEXT, productTypeId INTEGER) STRICT`;

export async function CategoryProductRel(db) {
  try {
    await execute(
      db,
      `CREATE TABLE IF NOT EXISTS CategoryProductRel(categoryProductRelID INTEGER, category TEXT, productTypeId INTEGER) STRICT`,
    );
  } catch (err) {
    console.error("there was an error", err);
  }
}
