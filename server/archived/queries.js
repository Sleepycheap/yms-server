import { pool } from "./pool.js";




export async function getTruck() {
  const { rows } = await pool.query(
    "SELECT truck_id, org_code FROM shippable_trucks",
  );
  return rows;
}

export async function getTruckByID(truck_id) {
  const { rows } = await pool.query(
    "SELECT truck_id, org_code FROM shippable_trucks WHERE truck_id = $1",
    [truck_id],
  );
  return rows;
}

export async function getTrucksByOrg(org_code) {
  const { rows } = await pool.query(
    "SELECT truck_id, org_code FROM shippable_trucks WHERE org_code = $1",
    [org_code],
  );
  return rows;
}

export async function addTruck(newTruck) {
  await pool.query(
    "INSERT INTO shippable_trucks (truck_id, org_code) VALUES ($1, $2)",
    [newTruck.truck_id, newTruck.org_code],
  );
}

export async function deleteTruck(truck_id) {
  await pool.query("DELETE FROM shippable_trucks WHERE truck_id = $1", [
    truck_id,
  ]);
}

export async function getAllItems() {
  const { rows } = await pool.query("SELECT * FROM items");
  return rows;
}

export async function getOneItem(part_number) {
  const { rows } = await pool.query(
    "SELECT * FROM items WHERE part_number = $1",
    [part_number],
  );
  return rows;
}

export async function addItem(newItem) {
  //  const { part_number, description, part_mark } = req.body;
  //const newItem = {part_number, description, part_mark};
  await pool.query(
    "INSERT INTO items (part_number, description, part_mark) VALUES ($1, $2, $3)",
    [newItem.part_number, newItem.description, newItem.part_mark],
  );
}

export async function deleteItem(part_number) {
  await pool.query("DELETE FROM items WHERE part_number = $1", [part_number]);
}

export async function getAllUsers() {
  const { rows } = await pool.query("SELECT * FROM users");
  return rows;
}

export async function addUser(newUser) {
  //  const { part_number, description, part_mark } = req.body;
  //const newItem = {part_number, description, part_mark};
  await pool.query(
    "INSERT INTO users (first_name, last_name, plant) VALUES ($1, $2, $3)",
    [newUser.first_name, newUser.last_name, newUser.plant],
  );
}

export async function getUserByName(first_name) {
  await pool.query("SELECT * FROM users WHERE first_name = $1", [first_name]);
}

export async function deleteUser(id) {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
}

export async function getAllOrders() {
  const { rows } = await pool.query("SELECT * FROM orders");
  return rows;
}

export async function getOrderByOrderNumber(order_number) {
  const { rows } = await pool.query(
    "SELECT a.order_number, a.customer, b.quantity, c.description FROM orders a INNER JOIN order_items b USING(order_number) INNER JOIN items c ON b.part_id = c.id WHERE a.order_number = $1",
    [order_number],
  );
  return rows;
}

export async function addOrder(newOrder) {
  await pool.query(
    "INSERT INTO orders (order_number, customer) VALUES ($1, $2)",
    [newOrder.order_number, newOrder.customer],
  );
}

export async function deleteOrder(order_number) {
  await pool.query("DELETE FROM orders WHERE order_number = $1", [
    order_number,
  ]);
}

export async function getAllPackages() {
  const { rows } = await pool.query("SELECT * FROM packages");
  return rows;
}

export async function getAllPackageDetails() {
  const { rows } = await pool.query(
    " SELECT a.package_name, a.order_number, a.status, b.quantity, c.part_number, c.description, c.part_mark FROM packages a INNER JOIN order_items b USING(order_number) INNER JOIN items c ON b.part_id = c.id",
  );
  return rows;
}

export async function getPackageDetailsByOrderNumber(order_number) {
  const { rows } = await pool.query(
    " SELECT a.package_name, a.order_number, a.status, b.quantity, c.part_number, c.description, c.part_mark FROM packages a INNER JOIN order_items b USING(order_number) INNER JOIN items c ON b.part_id = c.id WHERE order_number = $1",
    [order_number],
  );
  return rows;
}

export async function getPackageDetailsByPackageName(package_name) {
  const { rows } = await pool.query(
    "SELECT a.package_name, a.order_number, a.status, b.quantity, c.part_number, c.description, c.part_mark FROM packages a INNER JOIN order_items b USING(order_number) INNER JOIN items c ON b.part_id = c.id WHERE package_name = $1",
    [package_name],
  );
  return rows;
}

export async function addPackage(newPackage) {
  await pool.query(
    "INSERT INTO packages (package_name, order_number, status) VALUES ($1, $2, $3)",
    [newPackage.package_name, newPackage.order_number, newPackage.status],
  );
}

export async function deletePackage(order_number, package_name) {
  await pool.query(
    "DELETE FROM pacakges WHERE order_number = $1 AND package_name = $2",
    [order_number, package_name],
  );
}

export async function getAllContainers() {
  const { rows } = await pool.query("SELECT * FROM containers");
  return rows;
}

export async function getContainerDetails(container_name) {
  const { rows } = await pool.query(
    "SELECT a.order_number, b.package_name, b.status FROM containers a INNER JOIN packages b USING(order_number) WHERE a.container_name = $1",
    [container_name],
  );
  return rows;
}

export async function getAllLoads() {
  const { rows } = await pool.query(
    "SELECT distinct a.order_number, a.customer, b.container_name, c.package_name, c.status, d.quantity, e.description FROM orders a INNER JOIN containers b USING(order_number) INNER JOIN packages c USING(order_number) INNER JOIN order_items d USING(order_number) INNER JOIN items e ON d.part_id = e.id;",
  );
  return rows;
}

export async function getObjectById(tablename, id) {
  const { rows } = await pool.query("SELECT * FROM = $1 WHERE id = $2", [
    tablename,
    id,
  ]);
  return rows;
}

//
// export async function getAllLoads() {
//   const { rows } = await pool.query(
//     "SELECT loads.truckid, orderid, plant, total_weight, total_qty, container, description, gross_qty, gross_wgt, shipping_ins FROM loads INNER JOIN items ON loads.truckid = items.truckid",
//   );
//   return rows;
// }

// export async function getLoadsByTruckID(truckid) {
//   const { rows } = await pool.query(
//     "SELECT loads.truckid, orderid, plant, total_weight, total_qty, container, description, gross_qty, gross_wgt, shipping_ins FROM loads INNER JOIN items ON loads.truckid = items.truckid WHERE loads.truckid = $1",
//     [truckid],
//   );
//   return rows;
// }

//CREATE TABLE order_packages AS SELECT orderids.order_number, packages.package_name, packages.packed_qty FROM orderids JOIN packages ON orderids.order_number = packages.order_id;
//SELECT orderids.order_number, packages.package_name, packages.packed_qty FROM orderids JOIN packages ON orderids.order_number = packages.order_id;

// Create table from other tables
