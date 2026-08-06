export class CategoryProductRel {
  constructor(categoryProductRelID, category, productTypeId) {
    this.categoryProductRelID = categoryProductRelID;
    this.category = category;
    this.productTypeId = productTypeId;
  }

  pk() {
    return "categoryProductRelID";
  }

  columns() {
    return [
      "categoryProductRelID INTEGER",
      "category TEXT",
      "productTypeID INTEGER",
    ];
  }

  name() {
    return "CategoryProductRel";
  }
}
