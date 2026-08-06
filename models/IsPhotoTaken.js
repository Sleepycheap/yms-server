export class IsPhotoTaken {
  constructor(totalCount) {
    this.totalCount = totalCount;
  }

  pk() {
    return "totalCount";
  }

  columns() {
    return ["totalCount INT"];
  }

  name() {
    return "IsPhotoTaken";
  }
}
