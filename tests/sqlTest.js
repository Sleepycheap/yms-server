import oracledb from "oracledb";
import { pool } from "../db/pool.js";

async function testProcedure() {
  try {
    const connection = await pool.getConnection();
    const result = await connection.execute(
      `
      BEGIN 
        xxbbna_category_questions; END;`,
      // { x_questions_table: { dir: oracledb.BIND_OUT, type: oracledb.STRING } },
    );
    console.log("result", result);
  } catch (err) {
    console.log("there was an error", err.message);
  }
}

testProcedure();
