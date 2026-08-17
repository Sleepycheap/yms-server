import dotenv from "dotenv";
dotenv.config({ path: "../server/.env" });

console.log(process.env.NODE_ORACLEDB_USER);
