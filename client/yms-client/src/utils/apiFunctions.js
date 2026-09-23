// import dotenv from "dotenv";
import axios from 'axios'
// dotenv.config({ path: "../server/.env" });
const url = 'http://localhost:8080/api';
const propUrl = 'http://localhost:8080/propagate'

class ClientError extends Error {
  constructor(message, data = {}) {
    super(message);
    this.code = data.code;
    this.statusCode = data.statusCode || 500;
    this.details = data.details || null;
  }
}

export async function getUserID(upn) {
  const response = await axios.get(`${url}/userID/${upn}`)
  const {data} = response;
  return data
}

export async function getTruckImage(userid) {
  const response = await axios.get(`${url}/truckPhoto/${userid}`)
  const {data} = response
  return data
}

export async function getTrucks(org_code) {
  const response = await axios.get(`${url}/trucks?org_code=${org_code}`)
  const {data} = response;
  return data;
}

export async function getScacCodes() {
  const response = await axios.get(`${url}/scaccodes`)
  const {data} = response
  return data
}

export async function getTextFromImage(imageSrc) {
  const response = await axios.get(`${url}/:imageSrc`)
  const {data} = response
  return data
}

export async function getContainers(orderNumber) {
  const response = await axios.post(`${propUrl}/containers`, {order_number: orderNumber})
  const {data} = response
  return data;
}


export async function getFilteredContainers(orderNumber, filter) {
  const response = await axios.get(`${url}/details/${orderNumber}?filter=${filter}`)
  const {data} = response;
  return data
}

export async function getUnloadedContainers(orderNumber) {
  const response = await axios.get(`${url}/details/unpicked/${orderNumber}`)
  const {data} = response;
  return data;
}


export async function getWeight(truckid) {
  const response = await axios.get(`${url}/getweight/${truckid}`)
  const {data} = response;
  return data
}

export async function getCustomerName(orderNumber) {
  const response = await axios.get(`${url}/customer/${orderNumber}`)
  const {data} = response;
  return data
}

export async function verifyOrder(orgCode, orderNumber) {
  const response = await axios.get(`${url}/verifyOrder/${orgCode}/${orderNumber}`)
  const {data} = response;
  return data; 
};

export async function verifyContainer(orderNumber, cont) {
  const response = await axios.get(`${url}/verifyContainer/${orderNumber}/${cont}`)
  const {data} = response;
  return data;
}

export async function loadContainer(order_number, cont_name, org_code, direct_truck, user_id) {
  try {
    const response = await axios.post(`${url}/containers/assign`, {order_number: order_number,
      cont_name: cont_name,
      ship_from_org_code: org_code,
      org: org_code,
      ship_set_name: null,
      truck_id: direct_truck,
      assign_type: 'A',
      user_id: user_id,
      header_truck: direct_truck,
      truck_flag: "M",})
    // if (response )
      const {data} = response;
      console.log(`${cont_name} has been loaded onto ${direct_truck}`)
      return data;
    } catch (error) {
      const err = error.response.data
      console.log(err)
      throw new Error(err)
    }
  }

export async function unloadContainer(order_number, cont_name, org_code, direct_truck, user_id) {
try {

  const response = await axios.post(`${url}/containers/assign`, {order_number: order_number,
    cont_name: cont_name,
    ship_from_org_code: org_code,
    org: org_code,
    ship_set_name: null,
    truck_id: direct_truck,
    assign_type: 'R',
    user_id: user_id,
    header_truck: direct_truck,
    truck_flag: "M",})
    const {data} = response;
  
    console.log(`${cont_name} has been unloaded from ${direct_truck}`)
    return data;
  } catch (error) {
    const err = error.response.data
    throw new Error(err)
  }
}

export async function submitTruckImage(truck_id, user_id, truck_image) {
  try {
    const response = await axios.post(`${url}/truckPhoto`, {truck_id: truck_id, user_id: user_id, truck_image: truck_image}, {maxBodyLength: Infinity, maxContentLength: Infinity})
    const {data} = response
    return data
  } catch (error) {
    const err = error.response.data
      throw new ClientError('Error submitting Photo. Make sure file is a correct image format', {
        code: "Check Image Format Type",
        details: err.details
      })
    // if (err.code !== 'NJS-011') {
    //   throw new Error(err.message)
    // }
  }
}

export async function getContainerName(item_description) {
  try {
    const response = await axios.get(`${url}/contname/${item_description}`);
    const {data} = response;
    return data
  } catch (err) {
    return err.message
  }
}

export async function getContainerDesc(cont_name) {
  try {
    const response = await axios.get(`${url}/description/${cont_name}`);
    const {data} = response;
    return data
  } catch (err) {
    return err.message
  }
}

export async function getContainerByID(id) {
  try {
    const response = await axios.get(`${url}/container/${id}`)
    const {data} = response;
    return data
  } catch (err) {
    return err.message
  }
}

export async function testPicPath() {
  try {
    const response = await axios.get(`${url}/photoTest`)
    const {data} = response
    return data
  } catch (err) {
    return err.message
  }
}