export class ScanningItem {
  constructor(
    ID,
    SequenceNumber,
    PartID,
    PartName,
    Container,
    OrderNumber,
    ItemDescription,
    HeaderDescription,
    ImagePath,
    UnitPrice,
    ShipSetName,
    GrossQuantity,
    GrossWeight,
    TruckID,
    ShippingInst,
    Category,
    CreatedDate,
    UpdatedDate,
    Location,
    CustomerName,
    ShipFromOrgCode,
    ProjectName,
    PartNumber,
    QuantityOrdered,
    OriginalPlant,
    QuantityShipped,
    BackOrderQuantity,
    ExtendedWeight,
    LoadTruckFlag,
    StagedFlag,
    StaggedCheckBoxReadOnlyFlag,
    TruckLoadButtonReadonlyFlag,
    staggedContent,
    ForeColorforList,
    StagedTruckID,
  ) {
    this.ID = ID;
    this.SequenceNumber = SequenceNumber;
    this.PartID = PartID;
    this.PartName = PartName;
    this.Container = Container;
    this.OrderNumber = OrderNumber;
    this.ItemDescription = ItemDescription;
    this.HeaderDescription = HeaderDescription;
    this.ImagePath = ImagePath;
    this.UnitPrice = UnitPrice;
    this.ShipSetName = ShipSetName;
    this.GrossQuantity = GrossQuantity;
    this.GrossWeight = GrossWeight;
    this.TruckID = TruckID;
    this.ShippingInst = ShippingInst;
    this.Category = Category;
    this.CreatedDate = CreatedDate;
    this.UpdatedDate = UpdatedDate;
    this.Location = Location;
    this.CustomerName = CustomerName;
    this.ShipFromOrgCode = ShipFromOrgCode;
    this.ProjectName = ProjectName;
    this.PartNumber = PartNumber;
    this.QuantityOrdered = QuantityOrdered;
    this.OriginalPlant = OriginalPlant;
    this.QuantityShipped = QuantityShipped;
    this.BackOrderQuantity = BackOrderQuantity;
    this.ExtendedWeight = ExtendedWeight;
    this.LoadTruckFlag = LoadTruckFlag;
    this.StagedFlag = StagedFlag;
    this.StaggedCheckBoxReadOnlyFlag = StaggedCheckBoxReadOnlyFlag;
    this.TruckLoadButtonReadonlyFlag = TruckLoadButtonReadonlyFlag;
    this.staggedContent = staggedContent;
    this.ForeColorforList = ForeColorforList;
    this.StagedTruckID = StagedTruckID;
  }

  pk() {
    return "ID";
  }

  columns() {
    return [
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
    ];
  }

  name() {
    return "IPConfiguration";
  }

  ToString() {
    return {
      PartName,
    };
  }
}
