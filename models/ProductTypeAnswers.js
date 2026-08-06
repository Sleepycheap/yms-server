export class ProductTypeAnswers {
  constructor(ProductTypeAnswerID, ProductTypeQuestionID, Answer, IsSelected) {
    this.ProductTypeAnswerID = ProductTypeAnswerID;
    this.ProductTypeQuestionID = ProductTypeQuestionID;
    this.Answer = Answer;
    this.IsSelected = IsSelected;
  }

  pk() {
    return "ProductTypeAnswerID";
  }

  columns() {
    return [
      "ProductTypeAnswerID INTEGER",
      "ProductTypeQuestionID INTEGER",
      "Answer TEXT",
      "IsSelected INTEGER",
    ];
  }

  name() {
    return "ProductTypeAnswers";
  }
}
