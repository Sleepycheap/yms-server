import { createTable } from "../db/handler.js";

export function ScanningItem() {
  return {
    name: "ScanningItem",
    columns: [
      "ID INTEGER",
      "SequenceNumber INTEGER",
      "PartID INTEGER",
      "PartName TEXT",
      "Container TEXT",
      "OrderNumber INTEGER",
      "ItemDescription TEXT",
      "HeaderDescription TEXT",
      "ImagePath TEXT",
      "UnitPrice REAL",
      "ShipSetName TEXT",
      "GrossQuantity REAL",
      "GrossWeight REAL",
      "TruckID TEXT",
      "ShippingInst TEXT",
      "Category TEXT",
      "CreatedDate TEXT",
      "UpdatedDate TEXT",
      "Location TEXT",
      "CustomerName TEXT",
      "ShipFromOrgCode TEXT",
      "ProjectName TEXT",
      "PartNumber TEXT",
      "QuantityOrdered REAL",
      "OriginalPlant TEXT",
      "QuantityShipped REAL",
      "BackOrderQuantity REAL",
      "ExtendedWeight REAL",
      "LoadTruckFlag TEXT",
      "StagedFlag INTEGER",
      "StaggedCheckBoxReadOnlyFlag INTEGER",
      "TruckLoadButtonReadonlyFlag INTEGER",
      "staggedContent TEXT",
      "ForeColorforList TEXT",
      "StagedTruckID TEXT",
    ],
    pk: "ID",

    create: createTable(
      "ScanningItem",
      "ID INTEGER, SequenceNumber INTEGER, PartID INTEGER, PartName TEXT, Container TEXT, OrderNumber INTEGER,  ItemDescription TEXT, HeaderDescription TEXT, ImagePath TEXT, UnitPrice REAL, ShipSetName TEXT, GrossQuantity REAL, GrossWeight REAL, TruckID TEXT, ShippingInst TEXT, Category TEXT, CreatedDate TEXT, UpdatedDate TEXT, Location TEXT, CustomerName TEXT, ShipFromOrgCode TEXT, ProjectName TEXT, PartNumber TEXT, QuantityOrdered REAL, OriginalPlant TEXT, QuantityShipped REAL, BackOrderQuantity REAL, ExtendedWeight REAL, LoadTruckFlag TEXT, StagedFlag INTEGER, StaggedCheckBoxReadOnlyFlag INTEGER, TruckLoadButtonReadonlyFlag INTEGER, staggedContent TEXT, ForeColorforList TEXT, StagedTruckID TEXT",
    ),
  };
}

/*
  ToString() {
    return {
      PartName,
    };
  }
    */
