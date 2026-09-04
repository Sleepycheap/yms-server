// const userPrincipalName = 'anthony.vauthier@bsbna.org'

// const username = userPrincipalName.split('@')[0].split('.').join(' ');

// console.log(username)

// import { getPosition } from "./src/utils/getPosition.js"
// import { determineClosestPlant } from "./src/utils/geoLocation.js"

// async function test() {
//   const obj = await getPosition();
//   console.log('obj',obj)
//   const center = {
//     lat: obj.coords.latitude,
//     lon: obj.coords.longitide,
//   }

//   console.log('center', center)
  
//   const orgcode = await determineClosestPlant(center)
// }

// test()
// import {store} from './src/store.js'

// function checkOrderNumber() {
//   const state = store.getState();
//   return state.order.orderNumber;
// }

// console.log(checkOrderNumber());
import { loadContainer } from "./src/utils/apiFunctions.js";


const test = await loadContainer(  2600429001,
  "10M",
  "ANN",
  "ANN",
  null,
  "2600429001T1",
  "A",
  122452,
  "2600429001T1",
  "M",)

console.log('test', test)