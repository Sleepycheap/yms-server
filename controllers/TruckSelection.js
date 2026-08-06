import { db } from "../db/database.js";
import {
  getTruckResponseTruck,
  deleteFromTable,
  deleteFromMany,
  TableMapping,
  insertIntoTable,
  getUserDetails,
  populateOrg,
} from "../db/handler.js";
import { ProductTypeAnswers } from "../models/ProductTypeAnswers.js";
import { ProductType } from "../models/ProductType.js";
import { CategoryProductRel } from "../models/CategoryProductRel.js";
import { ProductTypeQuestions } from "../models/ProductTypeQuestions.js";
import { Log } from "../models/Log.js";
import { GetTruckResponseTruck } from "../models/GetTruckResponseTruck.js";

// This item is a collection in source code. This may need to be converted into a Proxy object later

const truckList = getTruckResponseTruck();

const scacList = [];
const organizationCodeList = [];
const truckIdList = [];
const newtruckIDList = [];
const singlePointOrgList = [];
const globalTruckIDList = [];

let SelectedTruckID = "";

export async function populateCategoryQuestionAnswer() {
  try {
    db.deleteFromMany([
      "ProductType",
      "CategoryProductRel",
      "ProductTypeQuestions",
      "ProductTypeAnswers",
    ]);

    const res = await getProductQuestionaireResponse();

    const list = await getProductTypeResponse();

    for (let i = 0; i < list.length; i++) {
      try {
        const obj = new ProductType();
        obj.ProductTypeID = list[i].ProductTypeID;
        obj.ProductTypeName = list[i].ProductTypeName;
        db.transaction(() => {
          db.insertIntoTable(
            obj.name(),
            `('${obj.ProductTypeID}','${obj.ProductTypeName}')`,
          );
        });
      } catch (err) {
        console.log("err", err.message);
      }
    }

    const relRes = await getCatePrdTypeRelDataResponse();

    for (let i = 0; i < relTypeList.length; i++) {
      try {
        const obj = new CategoryProductRel();
        obj.categoryProductRelID = relTypeList[i].categoryProductRelID;
        obj.category = relTypeList[i].category;
        obj.productTypeId = relTypeList[i].productTypeID;
        db.transaction(() => {
          db.insertIntoTable(
            obj.name(),
            `('${obj.categoryProductRelID}','${obj.category}', '${obj.productTypeId}')`,
          );
        });
      } catch (err) {
        console.log(err.message);
      }
    }

    const questionList = await getPrdQuestionaireDataAsync();

    for (let i = 0; i < questionList.length; i++) {
      const obj = new ProductTypeQuestions();
      obj.ProductTypeQuestionID = questionList[i].ProductTypeQuestionID;
      obj.ProductTypeID = questionList[i].ProductTypeID;
      obj.ProductTypeName = "";
      obj.Question = questionList[i].Question;
      db.transaction(() => {
        db.insertIntoTable(
          obj.name(),
          `('${obj.ProductTypeQuestionID}', '${obj.ProductTypeID}', '${obj.ProductTypeName}', '${obj.Question}')`,
        );
      });
    }

    const answerList = await getPrdAnswerDataResponse();

    for (let i = 0; i < answerList.length; i++) {
      const obj = new ProductTypeAnswers();
      obj.ProductTypeAnswerID = answerList[i].ProductTypeAnswerID;
      obj.ProductTypeQuestionID = answerList[i].ProductTypeQuestionID;
      obj.Answer = answerList[i].Answer;
      db.transaction(() => {
        db.insertIntoTable(
          obj.name(),
          `('${obj.ProductTypeAnswerID}', '${obj.ProductTypeQuestionID}', '${obj.Answer}')`,
        );
      });
    }
  } catch (err) {
    console.log("There is an error", err.message);
  }
}

export async function populateTruck() {
  const Log1 = new Log();
  const truckNumberField = {
    ItemsSource: null,
    SelectedIndex: 0,
  };
  try {
    const truckResponse = await getTruckIDAsync();
    let index = 0;
    let i = 0;
    for (const t of truckResponse) {
      const globalObj = new GetTruckResponseTruck();
      const obj = new GetTruckResponseTruck();
      obj.truck_id = t.truck_id;
      if (SelectedTruckID !== "") {
        if (obj.truck_id === SelectedTruckID) selectedindex = i;
      }
      globalObj.truck_id = t.truck_id;
      truckIdList.push(obj);
      globalTruckIDList.push(globalObj);
      i++;
    }

    truckIdList.splice(0, 0, { truck_id: "--Select--" });
    globalTruckIDList.splice(0, 0, { truck_id: "--Select--" });
    truckNumberField.ItemsSource = truckIdList;
    truckNumberField.SelectedIndex = 0;
    if (SelectedTruckID != "") truckNumberField.SelectedIndex + 1;
    SelectedTruckID = "";
  } catch (err) {
    console.log(err.message);
  }
}

export async function populateSCACCode() {
  const Log1 = new Log();
  try {
    if (scacCodeField.SelectionBoxItem !== null || scacCodeField.Items !== null) {
      const scacList = [];
    }
    scacCodeField.ItemsSource = null;

    const SCACRequest = {};
    // orgObj = (ButlerWarehouseApp.DataModel.Response.OrgResponseOrg)organizationField.SelectedValue;
    const orgObj = await getOrgFieldSelectedValue();
    if (orgObj.org_code === '--Select--') {
      SCACRequest.OrgID = ""
    } else {
      SCACRequest.OrgID = orgObj.org_code;
      const OrganiztionCode = orgObj.org_code
    }
  }

}

export async function OnNavigatedTo() {
  getUserDetails();
  populateOrg();
  populateCategoryQuestionAnswer();
  populate;
}
