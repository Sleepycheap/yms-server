import { ScanningItem } from "../models/ScanningItem.js";
import { GrossObject } from "../models/GrossObject.js";
import { Log } from "../models/Log.js";
import { IPConfiguration } from "../models/IPConfiguration.js";
import { TruckImage } from "../models/TruckImage.js";
import { ProductType } from "../models/ProductType.js";
import { CategoryProductRel } from "../models/CategoryProductRel.js";
import { ProductTypeQuestions } from "../models/ProductTypeQuestions.js";
import { ProductTypeAnswers } from "../models/ProductTypeAnswers.js";
import { SignatureImg } from "../models/SignatureImg.js";
import { IsPhotoTaken } from "../models/IsPhotoTaken.js";
import { Environment } from "../models/Environment.js";
import { SinglePointOrgMap } from "../models/SinglePointOrgMap.js";
import { Containers } from "../models/Containers.js";
import { OrgCodes } from "../models/OrgCodes.js";
import {
  PopulateOrgCode,
  PopulateScac,
  PopulateTrucks,
} from "../oracle/oracleQueries.js";
import { ScacTable } from "../models/ScacTable.js";
import { Trucks } from "../models/Trucks.js";
import { dropManyTables } from "./handler.js";

const tables = [
  "CategoryProductRel",
  "Containers",
  "Environment",
  "GrossObject",
  "IPConfiguration",
  "IsPhotoTaken",
  "Log",
  "OrgCodes",
  "ProductType",
  "ProductTypeAnswers",
  "ProductTypeQuestions",
  "ScacTable",
  "ScanningItem",
  "SignatureImg",
  "SinglePointOrgMap",
  "TruckImage",
  "Trucks",
];

export function init() {
  try {
    dropManyTables(tables);
    CategoryProductRel().create;
    Containers().create;
    Environment().create;
    GrossObject().create;
    IPConfiguration().create;
    IsPhotoTaken().create;
    Log().create;
    ProductType().create;
    ProductTypeAnswers().create;
    ProductTypeQuestions().create;
    ScacTable().create;
    ScanningItem().create;
    SignatureImg().create;
    SinglePointOrgMap().create;
    TruckImage().create;
    OrgCodes().create;
    Trucks().create;
    console.log("All tables created");

    PopulateOrgCode();
    PopulateScac();
    PopulateTrucks();
  } catch (err) {
    console.error("there was an error initializing tables", err.message);
  } finally {
    console.log("Tables populated");
  }
}
