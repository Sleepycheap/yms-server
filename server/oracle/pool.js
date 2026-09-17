import oracledb from "oracledb";
import dotenv from "dotenv";
dotenv.config({ path: "../server/.env" });

// this tells the app to connect to oracle with
// the thick client
oracledb.initOracleClient();
oracledb.fetchAsBuffer = [oracledb.BLOB];

export const pool = await oracledb.createPool({
  user: process.env.NODE_ORACLEDB_USER,
  password: process.env.NODE_ORACLEDB_PASSWORD,
  connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
  queueTimeout: 0,
});
