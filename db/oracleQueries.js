import oracledb from "oracledb";

// const pool = oracledb.getPool();

// export const connection = await oracledb.createPool({
//   user: process.env.NODE_ORACLEDB_USER,
//   password: process.env.NODE_ORACLEDB_PASSWORD,
//   connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
// });

export async function testConnection() {
  try {
    const connection = await oracledb.getConnection();
    // oracledb.initOracleClient();
    const result = await connection.isHealthy();
    await connection.close();
    console.log(result);
    return result;
  } catch (err) {
    // console.log("there was an error", err);
    return err;
  }
}

export async function getTable(table) {
  try {
    console.log("connecting...");
    const connection = await oracledb.getConnection();
    console.log("connected");
    const sql = `SELECt * FROM ${table}`;
    console.log("running sql");
    const result = await connection.execute(sql);
    console.log("done");
    return result;
  } catch (err) {
    return err;
  }
}
