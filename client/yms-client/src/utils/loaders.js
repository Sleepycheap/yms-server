import { getTrucks } from "./apiFunctions";

export async function truckLoader({params}) {
  const {orgcode} = params;
  const trucks = await getTrucks(orgcode)
  return trucks
}