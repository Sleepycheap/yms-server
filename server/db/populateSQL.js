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

export function CreateTables() {
  try {
    ScanningItem().create;
    GrossObject().create;
    Log().create;
    IPConfiguration().create;
    TruckImage().create;
    ProductType().create;
    CategoryProductRel().create;
    ProductTypeQuestions().create;
    ProductTypeAnswers().create;
    SignatureImg().create;
    IsPhotoTaken().create;
    Environment().create;
    SinglePointOrgMap().create;
    console.log("All tables created");
  } catch (err) {
    console.error(err.message);
  }
}
