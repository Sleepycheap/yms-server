import { Pool } from "pg";

export const pool = new Pool({
  host: "localhost",
  user: "avauthier",
  database: "yms",
  password: "dbpassword",
  port: "5432",
});
