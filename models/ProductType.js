export class ProductType {
  constructor(ProductTypeID, ProductTypeName) {
    this.ProductTypeID = ProductTypeID;
    this.ProductTypeName = ProductTypeName;
  }

  pk() {
    return "ProductTypeID";
  }

  columns() {
    return ["ProductTypeID INTEGER", "ProductTypeName TEXT"];
  }

  name() {
    return "ProductType";
  }
}
