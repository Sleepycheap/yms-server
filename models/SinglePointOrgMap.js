export class SinglePointOrgMap {
  constructor(ID, singlePointOrg, baseOrg) {
    this.ID = ID;
    this.singlePointOrg = singlePointOrg;
    this.baseOrg = baseOrg;
  }

  pk() {
    return "ID";
  }

  columns() {
    return ["Id INT", "singlePointOrg TEXT", "baseOrg TEXT"];
  }

  name() {
    return "SinglePointOrgMap";
  }
}
