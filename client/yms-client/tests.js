// const userPrincipalName = 'anthony.vauthier@bsbna.org'

// const username = userPrincipalName.split('@')[0].split('.').join(' ');

// console.log(username)

import { getPosition } from "./src/utils/getPosition.js"
import { determineClosestPlant } from "./src/utils/geoLocation.js"

async function test() {
  const obj = await getPosition();
  console.log('obj',obj)
  const center = {
    lat: obj.coords.latitude,
    lon: obj.coords.longitide,
  }

  console.log('center', center)
  
  const orgcode = await determineClosestPlant(center)
}

test()

