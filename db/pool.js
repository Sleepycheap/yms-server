import { Pool } from "pg";
import oracledb from "oracledb";
import "dotenv/config";

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

/*
const oracledb = require('oracledb');

const mypw = ... // the hr schema password

async function(run){
    await using pool = await oracledb.createPool({
        user : "hr",
        password: process.env.PW,
        connectString : "localhost/FREEPDB1",
        poolMin: 1,
        poolMax: 5
    });

    await using connection = await pool.getConnection();

    const { resultSet } = await connection.execute(
        `SELECT department_id, department_name FROM departments
         ORDER BY department_id`,
        [], // no bind variables
        {
          resultSet: true,
        }
    );

    await using rs = resultSet;
    let row;
    let i = 1;

    while ((row = await rs.getRow())) {
      console.log("getRow(): row " + i++);
      console.log(row);
    }
}
run();
*/
