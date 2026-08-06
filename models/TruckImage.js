export class TruckImage {
  constructor(ID, TruckID, IsSelected, TruckImg, IsUploaded) {
    this.ID = ID;
    this.TruckID = TruckID;
    this.IsSelected = IsSelected;
    this.TruckImg = TruckImg;
    this.IsUploaded = IsUploaded;
  }

  pk() {
    return "ID";
  }

  columns() {
    return [
      "ID INT",
      "TruckID TEXT",
      "IsSelected INTEGER",
      "TruckImg BLOB",
      "IsUploaded TEXT",
    ];
  }

  name() {
    return "TruckImage";
  }
}
