import { pool } from "./pool.js";
import sql from "sql-template-tag";

const connection = await pool.getConnection();

export async function createFnd_Responsibilty_TL() {
  let array = [];
  const result = await connection.execute(`
    SELECT * FROM FND_RESPONSIBILITY_VL WHERE RESPONSIBILITY_NAME = 'BSCN Order Management Super User - SJG'
    `);
  const { rows } = result;
  const { metaData } = result;
  for (let i = 0; i < metaData.length; i++) {
    const { name } = metaData[i];
    // console.log("name", name);
    array.push(name);
  }
  // await connection.close();
  return rows;
}

console.log(await createFnd_Responsibilty_TL());

// const columns = [
//   `ROW_ID VARCHAR2, WEB_HOST_NAME VARCHAR2, WEB_AGENT_NAME VARCHAR2, APPLICATION_ID NUMBER, RESPONSIBILITY_ID NUMBER, RESPONSIBILITY_KEY VARCHAR2, LAST_UPDATE_DATE DATE, LAST_UPDATED_BY NUMMBER, CREATION_DATE DATE, CREATED_BY NUMBER, LAST_UPDATE_LOGIN NUMBER, DATA_GROUP_APPLICATION_ID NUMBER, DATA_GROUP_ID NUMBER, MENU_ID NUMBER, START_DATE DATE, END_DATE DATE, GROUP_APPLICATION_ID NUMBER, REQUEST_GROUP_ID NUMBER, VERSION NUMBER,RESPONSIBILITY_NAME VARCHAR2, DESCRIPTION VARCHAR2`,
// ];

// createFnd_Responsibilty_TL();

async function createTable() {
  // const array = await createFnd_Responsibilty_TL();
  await connection.execute(
    sql`CREATE TABLE fnd_responsibility_tl (ROW_ID VARCHAR2(150), WEB_HOST_NAME VARCHAR2(100), WEB_AGENT_NAME VARCHAR2(50), APPLICATION_ID NUMBER, RESPONSIBILITY_ID NUMBER, RESPONSIBILITY_KEY VARCHAR2(100), LAST_UPDATE_DATE DATE, LAST_UPDATED_BY NUMBER, CREATION_DATE DATE, CREATED_BY NUMBER, LAST_UPDATE_LOGIN NUMBER, DATA_GROUP_APPLICATION_ID NUMBER, DATA_GROUP_ID NUMBER, MENU_ID NUMBER, START_DATE DATE, END_DATE DATE, GROUP_APPLICATION_ID NUMBER, REQUEST_GROUP_ID NUMBER, VERSION NUMBER,RESPONSIBILITY_NAME VARCHAR2(100), DESCRIPTION VARCHAR2(100));`,
  );
  // await connection.close();
  // console.log("result", result);
}

// await createTable();

export async function getBSNAShippingIDs() {
  const result = await connection.execute(
    `SELECT * FROM FND_RESPONSIBILITY_VL WHERE RESPONSIBILITY_NAME = 'BSNA Shipping'`,
  );
  const { rows } = result;
  return rows;
}

// console.log(await getBSNAShippingIDs());

const columns = `
  'ROW_ID',
  'WEB_HOST_NAME',
  'WEB_AGENT_NAME',
  'APPLICATION_ID',
  'RESPONSIBILITY_ID',
  'RESPONSIBILITY_KEY',
  'LAST_UPDATE_DATE',
  'LAST_UPDATED_BY',
  'CREATION_DATE',
  'CREATED_BY',
  'LAST_UPDATE_LOGIN',
  'DATA_GROUP_APPLICATION_ID',
  'DATA_GROUP_ID',
  'MENU_ID',
  'START_DATE',
  'END_DATE',
  'GROUP_APPLICATION_ID',
  'REQUEST_GROUP_ID',
  'VERSION',
  'RESPONSIBILITY_NAME',
  'DESCRIPTION'
  `;

// export async function insertIntoRespTL(columns) {
//   const result = await connection.execute(`
//     INSERT INTO fnd_responsibility_tl (${columns})
//     SELECT * FROM FND_RESPONSIBILITY_VL WHERE RESPONSIBILITY_NAME = 'BSNA Shipping';`);
//   return result;
// }

// console.log(await insertIntoRespTL(columns));

// const bsnaShipping = [
//       'AAMFzrAOEAAB6mOAAC',
//     null,
//     null,
//     665,
//     50438,
//     'BUTLER_SHIPPING',
//     2010-01-15T21:23:22.000Z,
//     14503,
//     2003-02-11T23:45:58.000Z,
//     1516,
//     149150269,
//     300,
//     0,
//     74910,
//     2003-02-03T06:00:00.000Z,
//     null,
//     300,
//     100,
//     '4',
//     'BSNA Shipping',
//     'Shipping responsibility that has all manufacturing orgs'
// ]
