import { Client } from "pg";
import "dotenv/config";

const sql = `CREATE TABLE IF NOT EXISTS truckid (
truckid VARCHAR (20) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS orderid (
orderid INTEGER (10) PRIMARY KEY,
truckid VARCHAR (20) references truckid(truckid)
);

CREATE TABLE IF NOT EXISTS items (
id INTERGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
container VARCHAR (4),
description VARCHAR,
gross_qty INTEGER,
gross_wgt INTEGER,
shipping_ins VARCHAR,
truckid VARCHAR (20) references truckid(truckid)
);

CREATE TABLE IF NOT EXISTS loads (
truckid VARCHAR (20) PRIMARY KEY references truckid(truckid),
orderid INTEGER (10) references orderid(orderid),
plant VARCHAR,
total_weight INTEGER,
total_qty INTEGER
);

CREATE TABLE IF NOT EXISTS orders (
orderid INTEGER (10) PRIMARY KEY references orderid(orderid),
truckid VARCHAR (20) references truckid(truckid),
customer VARCHAR
);


INSERT INTO truckid (truckid)
VALUES
('AAE2111111072226'),
('PRIJ12345678LA0722');

INSERT INTO orderid (orderid, truckid)
VALUES
('0102030405', 'AAE2111111072226'),
('1234567890', 'PRIJ12345678LA0722');

INSERT INTO items (container, description, gross_qty, gross_wgt, shipping_ins, truckid)
VALUES
('1AA', 'fg-shiploose flat clip-gray-30.750', '197', '2041', 'N/A', 'AAE2111111072226'),
('1M', 'fg-column (tekla)-gray-577.500', '1', '4987', 'N/A', 'AAE2111111072226'),
('2M', 'fg-column (tekla)-gray-577.500', '1', '4989', 'N/A', 'PRIJ12345678LA0722');

INSERT INTO loads (truckid, orderid, plant, total_weight, total_qty)
VALUES
('AAE2111111072226', '0102030405', 'STJ', '7028', '198'),
('PRIJ12345678LA0722', '1234567890', 'JAC', '4989', '1');

INSERT INTO orders (orderid, truckid, customer)
VALUES
('0102030405', 'AAE2111111072226', 'setzer properties llc'),
('1234567890', 'PRIJ12345678LA0722', 'bluescope construction');
`;

async function main() {
  try {
    console.log("seeding...");
    const client = new Client({
      connectionString: process.env.DB_STRING,
    });
    await client.connect();
    // await client.query(SQL);
    await client.end();
    console.log("done");
  } catch (err) {
    console.log(err);
  }
}

main();
