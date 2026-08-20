// import dotenv from "dotenv";
import axios from 'axios'
// dotenv.config({ path: "../server/.env" });
const url = 'http://localhost:8080/api';

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