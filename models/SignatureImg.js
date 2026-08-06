export class SignatureImg {
  constructor(ID, TruckID, SignatureImage) {
    this.ID = ID;
    this.TruckID = TruckID;
    this.SignatureImage = SignatureImage;
  }

  pk() {
    return "ID";
  }

  columns() {
    return ["ID INT", "TruckID TEXT", "SignatureImg BLOB"];
  }

  name() {
    return "SignatureImg";
  }
}
