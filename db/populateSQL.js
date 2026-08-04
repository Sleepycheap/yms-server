export function populate() {
  const sql = `CREATE TABLE IF NOT EXISTS ScanningItem(ID INTEGER, SequenceNumber INTEGER, PartID INTEGER, PartName TEXT, Container TEXT, OrderNumber INTEGER, ItemDescription TEXT, HeaderDescription TEXT, ImagePath TEXT, UnitPrice REAL, ShipSetName TEXT, GrossQuantity REAL, GrossWeight REAL, TruckID TEXT, ShippingInst TEXT, Categoru TEXT, CreatedDate TEXT, UpdatedDate TEXT, Location TEXT, CustomerName TEXT, ShipFromOrgCode TEXT, ProjectName TEXT, PartNumber TEXT, QuantityOrdered REAL, OriginalPlant TEXT, QuantityShipped REAL, BackOrderQuantity REAL, ExtendedWeight REAL, LoadTruckFlag TEXT, StagedFlag INTEGER, StaggedCheckBoxReadOnlyFlag INTEGER, TruckLoadButtonReadOnlyFlag INTEGER, staggedContent TEXT, ForeColorforList TEXT, StagedTruckID TEXT) STRICT;

  CREATE TABLE IF NOT EXISTS GrossObject(ID INTEGER, truckID TEXT, totalWeight REAL, totalQuantity REAL) STRICT;

CREATE TABLE IF NOT EXISTS Log(ID INTEGER, LogMessage TEXT, TimeStamp TEXT) STRICT;

CREATE TABLE IF NOT EXISTS IPConfiguration(ID INTEGER, instanceName TEXT, HostAddress TEXT, PortNumber TEXT) STRICT;

CREATE TABLE IF NOT EXISTS TruckImage(ID INTEGER, TruckID TEXT, IsSelected INTEGER, TruckImg BLOB, IsUploaded TEXT) STRICT;

CREATE TABLE IF NOT EXISTS ProductType(ProductTypeID INTEGER, ProductTypeName TEXT) STRICT;

CREATE TABLE IF NOT EXISTS CategoryProductRel(categoryProductRelId INTEGER, category TEXT, productTypeID INTEGER) STRICT;

CREATE TABLE IF NOT EXISTS ProductTypeQuestions(ProductTypeQuestionID INTEGER, ProductTypeID INTEGER, Question TEXT, ProductTypeName TEXT) STRICT;

CREATE TABLE IF NOT EXISTS ProductTypeAnswers(ProductTypeAnswerId INTEGER, ProductTypeQuestionID INTEGER, Answer TEXT, IsSelected INTEGER) STRICT;

CREATE TABLE IF NOT EXISTS SignatureImg(ID INTEGER, TruckID TEXT, SignatureImage BLOB) STRICT;

CREATE TABLE IF NOT EXISTS IsPhotoTaken(totalCount INTEGER) STRICT;

CREATE TABLE IF NOT EXISTS Environment(ID INTEGER, instanceName TEXT, instanceIP TEXT) STRICT;

CREATE TABLE IF NOT EXISTS SinglePointOrgMap(ID INTEGER, singlePointOrg TEXT, baseOrg TEXT) STRICT;
`;
  return sql;
}
