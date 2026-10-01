import {
  getPickedContainersForOrder,
  getUnpickedContainersForOrder,
  updateTruckID,
} from "../oracle/functions.js";

export async function pickedContainers(req, res) {
  const { order_number } = req.params;
  try {
    const result = await getPickedContainersForOrder(order_number);
    // const { picked, unpicked } = result;
    // const containers = { picked, unpicked };
    res.json(result);
  } catch (err) {
    console.log("there was an error getting containers", err.message);
    res.status(404).json({ "error getting containers": err.message });
  }
}

export async function unpickedContainers(req, res) {
  const { order_number } = req.params;
  try {
    const result = await getUnpickedContainersForOrder(order_number);
    res.json(result);
  } catch (err) {
    res.status(404).json({ "error getting containers": err.message });
  }
}

export async function assignContainers(req, res) {
  const {
    order_number,
    cont_name,
    ship_from_org_code,
    org,
    ship_set_name,
    truck_id,
    assign_type,
    user_id,
    header_truck,
    truck_flag,
  } = req.body;

  try {
    const result = await updateTruckID(
      order_number,
      cont_name,
      ship_from_org_code,
      org,
      ship_set_name,
      truck_id,
      assign_type,
      user_id,
      header_truck,
      truck_flag,
    );
    const { status } = result;
    if (status !== "S") throw new Error(status);
    res.json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
}
