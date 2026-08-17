import { Pool } from "pg";
import oracledb from "oracledb";
import dotenv from "dotenv";
dotenv.config({ path: "../server/.env" });
// export const pool = new Pool({
//   host: "localhost",
//   user: "avauthier",
//   database: "yms",
//   password: "dbpassword",
//   port: "5432",
// });

oracledb.initOracleClient();

export const pool = await oracledb.createPool({
  user: process.env.NODE_ORACLEDB_USER,
  password: process.env.NODE_ORACLEDB_PASSWORD,
  connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
});
