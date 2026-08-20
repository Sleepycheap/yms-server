import { insideCircle, distanceTo } from "geolocation-utils";



export async function determineClosestPlant(center) {
  const radius = 241402 // 150 miles converted to meters
  if (insideCircle({lat: 40.33865, lon: -76.49658}, center, radius)) {
    return 'ANN'
  } else if (insideCircle({lat: 42.77382, lon: -89.29432}, center, radius)) {
    return 'EVA'
  } else if (insideCircle({lat: 25.776394564752714, lon: -100.13842015767217}, center, radius)) {
    return 'MTY'
  } else if (insideCircle({lat: 34.51201, lon: -85.845}, center, radius)) {
    return 'RAI' 
} else if (insideCircle({lat: 39.71837610921273, lon: -94.89235585581964}, center, radius)) {
    return 'STJ' 
} else if (insideCircle({lat: 36.34749, lon: -119.37457}, center, radius)) {
    return 'VIS'
} else if (insideCircle({lat: 35.659237363742214, lon: -88.77931854232784}, center, radius)) {
    return 'JAC' 
} else {
  return 'NO GPS'
}
}




const annville = {
  lat: 40.33865,
  long: -76.49658
};

const evansville = {
  lat: 42.77382,
  long: -89.29432  
};
const monterrey = {
      lat: 25.776394564752714, 
      long: -100.13842015767217
    }
const rainsville = {
  lat: 34.51201,
  long: -85.845
}
const stJoseph = {  
  lat: 39.71837610921273,
  long: -94.89235585581964
}

const visalia = {
  lat: 36.34749,
  long: -119.37457
}

const jackson = {
  lat: 35.659237363742214,
  long: -88.77931854232784
}

