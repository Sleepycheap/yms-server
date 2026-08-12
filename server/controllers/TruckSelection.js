import { db } from "../db/database.js";
import os from "node:os";
import {
  // getTruckResponseTruck,
  deleteFromTable,
  deleteFromMany,
  TableMapping,
  insertIntoTable,
  // getUserDetails,
} from "../db/handler.js";
import { ProductTypeAnswers } from "../models/ProductTypeAnswers.js";
import { ProductType } from "../models/ProductType.js";
import { CategoryProductRel } from "../models/CategoryProductRel.js";
import { ProductTypeQuestions } from "../models/ProductTypeQuestions.js";
import { Log } from "../models/Log.js";
// import { GetTruckResponseTruck } from "../models/GetTruckResponseTruck.js";
import {
  PopulateCategoryProductRel,
  PopulateProductAnswers,
  PopulateProductQuestions,
  PopulateProductType,
  GetOrgCode,
  GetScac,
  GetTrucks,
} from "../oracle/oracleQueries.js";

// This item is a collection in source code. This may need to be converted into a Proxy object later

// const truckList = getTruckResponseTruck();

const scacList = [];
const organizationCodeList = [];
const truckIdList = [];
const newtruckIDList = [];
const singlePointOrgList = [];
const globalTruckIDList = [];
let selectedOrgCode = "";

let SelectedTruckID = "";

export async function populateCategoryQuestionAnswer() {
  try {
    db.deleteFromMany([
      "ProductType",
      "CategoryProductRel",
      "ProductTypeQuestions",
      "ProductTypeAnswers",
    ]);

    PopulateProductType();

    PopulateCategoryProductRel();

    PopulateProductQuestions();

    PopulateProductAnswers();
  } catch (err) {}
}

export async function main(orgCode) {
  getUserDetails();
  populateOrg(orgCode);
  populateCategoryQuestionAnswer();
  populateSCACCode();
  getUserDetails();
}

export async function gotoTruckSelection(req, res) {
  const { orgCode } = req.params;
  const scacList = await populateSCACCode();
  const orgCodes = await populateOrg();
  const object = {
    title: "Truck Selection",
    user: await getUserDetails(),
    scacList,
    orgCodes,
    truckList: await populateTruck(orgCode),
  };
  res.json(object);
}

export async function getOrgCode(req, res) {
  const orgCode = await populateOrg();
  res.json(orgCode);
}

export async function truckSelectionTest(orgCode) {
  return {
    title: "Truck Selection",
    user: await getUserDetails(),
    scacList: await populateSCACCode(),
    orgCodes: await populateOrg(),
    truckList: await populateTruck(orgCode),
  };
}

export async function getScacList(req, res) {
  const result = await populateSCACCode();
  return result;
}

export async function getTruckList(req, res) {
  const { orgCode } = req.params;
  const result = await populateTruck(orgCode);
  res.json(result);
}

export async function populateOrg(orgCode) {
  try {
    const orgCodes = await GetOrgCode();
    // console.log(orgCodes);
    for (let i = 0; i < orgCodes.length; i++) {
      organizationCodeList.push(orgCodes[i][0]);
    }
    organizationCodeList.unshift("--Select--");
    return organizationCodeList;
  } catch (err) {
    console.log("there was an error", err.message);
  }

  // try {
  //   const computerName = os.hostname();
  //   if (computerName.startsWith("KC")) {
  //     selectedOrgCode = "STJ";
  //   } else {
  //     selectedOrgCode = orgCode;
  //   }
  //   return selectedOrgCode;
  // } catch (err) {
  //   console.log(err.message);
  // }
}

export async function getUserDetails() {
  const { username } = os.userInfo();
  return username;
}

export async function populateSCACCode() {
  const list = await GetScac();
  for (const i of list) {
    scacList.push(i);
  }
  return scacList;
}

export async function populateTruck(orgCode) {
  const list = await GetTrucks(orgCode);
  for (const i of list) {
    truckIdList.push(i);
  }
  return truckIdList;
}

// main(orgCode);

// async function testScac() {
//   const scac = await populateSCACCode();
//   scac.forEach((code) => {
//     console.log("code", code[0]);
//   });
// }

// testScac();
