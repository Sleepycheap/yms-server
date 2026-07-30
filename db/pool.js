import { Pool } from "pg";
import oracledb from "oracledb";
import "dotenv/config";

export const pool = new Pool({
  host: "localhost",
  user: "avauthier",
  database: "yms",
  password: "dbpassword",
  port: "5432",
});
