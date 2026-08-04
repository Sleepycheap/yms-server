`CREATE TABLE IF NOT EXISTS ScanningItem(ID INTEGER, SequenceNumber INTEGER, PartID INTEGER, PartName TEXT, Container TEXT, OrderNumber INTEGER, ItemDescription TEXT, HeaderDescription TEXT, ImagePath TEXT, UnitPrice DECIMAL, ShipSetName TEXT, GrossQuantity DECIMAL, GrossWeight DECIMAL, TruckID TEXT, ShippingInst TEXT, Categoru TEXT, CreatedDate TEXT, UpdatedDate TEXT, Location TEXT, CustomerName TEXT, ShipFromOrgCode TEXT, ProjectName TEXT, PartNumber TEXT, QuantityOrdered DECIMAL, OriginalPlant TEXT, QuantityShipped DECIMAL, BackOrderQuantity DECIMAL, ExtendedWeight DECIMAL, LoadTruckFlag TEXT, StagedFlag BOOLEAN, StaggedCheckBoxReadOnlyFlag BOOLEAN, TruckLoadButtonReadOnlyFlag BOOLEAN, staggedContent TEXT, ForeColorforList TEXT, StagedTruckID TEXT) STRICT;

CREATE TABLE IF NOT EXISTS GrossObject(ID INTEGER, truckID TEXT, totalWeight DECIMAL, totalQuantity DECIMAL) STRICT;

CREATE TABLE IF NOT EXISTS Log(ID INTEGER, LogMessage TEXT, TimeStamp TEXT) STRICT;

CREATE TABLE IF NOT EXISTS IPConfiguration(ID INTEGER, instanceName TEXT, HostAddress TEXT, PortNumber TEXT) STRICT;

CREATE TABLE IF NOT EXISTS TruckImage(ID INTEGER, TruckID, IsSelected BOOLEAN, TruckImg BLOB, IsUploaded TEXT) STRICT;

CREATE TABLE IF NOT EXISTS ProductType(ProductTypeID INTEGER, ProductTypeName TEXT) STRICT;

CREATE TABLE IF NOT EXISTS CategoryProductRel(categoryProductRelId INTEGER, category TEXT, productTypeID INTEGER) STRICT;

CREATE TABLE IF NOT EXISTS ProductTypeQuestions(ProductTypeQuestionID INTEGER, ProductTypeID INTEGER, Question TEXT, ProductTypeName TEXT) STRICT;

CREATE TABLE IF NOT EXISTS ProductTypeAnswers(ProductTypeAnswerId INTEGER, ProductTypeQuestionID INTEGER, Answer TEXT, IsSelected BOOLEAN) STRICT;

CREATE TABLE IF NOT EXISTS SignatureImg(ID INTEGER, TruckID TEXT, SignatureImage BLOB) STRICT;

CREATE TABLE IF NOT EXISTS IsPhotoTaken(totalCount INTEGER) STRICT;

CREATE TABLE IF NOT EXISTS Environment(ID INTEGER, instanceName TEXT, instanceIP TEXT) STRICT;

CREATE TABLE IF NOT EXISTS SinglePointOrgMap(ID INTEGER, singlePointOrg TEXT, baseOrg TEXT) STRICT;
`;
