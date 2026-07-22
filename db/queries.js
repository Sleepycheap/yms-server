import { pool } from "./pool.js";

export async function getTruckId() {
  const { rows } = await pool.query("SELECT * FROM truckid");
  return rows;
}

export async function addTruckId(newTruckId) {
  await pool.query("INSERT INTO truckid (truckid) VALUES ($1)", [
    newTruckId.truckId,
  ]);
}

export async function getCarriers() {
  const { rows } = await pool.query("SELECT * FROM carriers");
  return rows;
}

export async function addCarriers(newCarrier) {
  await pool.query("INSERT INTO carriers (scac_code, name) VALUES ($1, $2)", [
    newCarrier.scac_code,
    newCarrier.name,
  ]);
}

export async function getAllItems() {
  const { rows } = await pool.query("SELECT * FROM items");
  return rows;
}

export async function getItemsByTruckID(truckid) {
  const { rows } = await pool.query("SELECT * FROM items WHERE truckid = $1", [
    truckid,
  ]);
  return rows;
}

export async function getObjectById(tablename, truckid) {
  const { rows } = await pool.query("SELECT * FROM = $1 WHERE truckid = $2", [
    tablename,
    truckid,
  ]);
  return rows;
}

export async function getOrderByID(orderid) {
  const { rows } = await pool.query(
    "SELECT orders.orderid AS orderid, customer, loads.truckid AS truckid, plant, total_weight, total_qty, items.id AS itemid, container, description, gross_qty, gross_wgt FROM orders INNER JOIN loads ON orders.truckid = loads.truckid INNER JOIN items ON loads.truckid = items.truckid WHERE orders.orderid = $1",
    [orderid],
  );
  return rows;
}

export async function getAllOrders() {
  const { rows } = await pool.query(
    "SELECT orders.orderid AS orderid, customer, loads.truckid AS truckid, plant, total_weight, total_qty, items.id AS itemid, container, description, gross_qty, gross_wgt FROM orders INNER JOIN loads ON orders.truckid = loads.truckid INNER JOIN items ON loads.truckid = items.truckid",
  );
  return rows;
}

export async function addItem(newItem) {
  await pool.query(
    "INSERT INTO items (container, description, gross_qty, gross_wgt, shipping_ins, truckid) VALUES ($1, $2, $3, $4, $5, $6)",
    [
      newItem.container,
      newItem.description,
      newItem.gross_qty,
      newItem.gross_wgt,
      newItem.shipping_ins,
      newItem.truckid,
    ],
  );
}

export async function addOrder(newOrder) {
  await pool.query(
    "INSERT INTO orders (orderid, truckid, customer) VALUES ($1, $2, $3)",
    [newOrder.orderid, newOrder.truckid, newOrder.customer],
  );
}

export async function addLoad(newLoad) {
  await pool.query(
    "INSERT INTO loads (truckid, orderid, plant, total_weight, total_qty) VALUES ($1, $2, $3, $4, $5)",
    [
      newLoad.truckid,
      newLoad.orderid,
      newLoad.plant,
      newLoad.total_weight,
      newLoad.total_qty,
    ],
  );
}

export async function getAllLoads() {
  const { rows } = await pool.query(
    "SELECT loads.truckid, orderid, plant, total_weight, total_qty, container, description, gross_qty, gross_wgt, shipping_ins FROM loads INNER JOIN items ON loads.truckid = items.truckid",
  );
  return rows;
}

export async function getLoadsByTruckID(truckid) {
  const { rows } = await pool.query(
    "SELECT loads.truckid, orderid, plant, total_weight, total_qty, container, description, gross_qty, gross_wgt, shipping_ins FROM loads INNER JOIN items ON loads.truckid = items.truckid WHERE loads.truckid = $1",
    [truckid],
  );
  return rows;
}
