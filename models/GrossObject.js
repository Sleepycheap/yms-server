export class GrossObject {
  constructor(ID, truckID, totalWeight, totalQuantity) {
    this.ID = ID;
    this.truckID = truckID;
    this.totalWeight = totalWeight;
    this.totalQuantity = totalQuantity;
  }

  pk() {
    return "ID";
  }

  columns() {
    return ["ID INT", "truckID TEXT", "totalWeight REAL", "totalQuantity REAL"];
  }

  name() {
    return "GrossObject";
  }
}
