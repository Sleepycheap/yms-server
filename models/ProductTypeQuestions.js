import { ProductTypeAnswers } from "./ProductTypeAnswers.js";

export class ProductTypeQuestions {
  constructor(ProductTypeQuestionID, ProductTypeID, Question, ProductTypeName) {
    this.ProductTypeQuestionID = ProductTypeQuestionID;
    this.ProductTypeID = ProductTypeID;
    this.Question = Question;
    this.ProductTypeName = ProductTypeName;
  }

  pk() {
    return "ProductTypeQuestionID";
  }

  columns() {
    return [
      "ProductTypeQuestionID INTEGER",
      "ProductTypeID INTEGER",
      "Question TEXT",
      "ProductTypeName TEXT",
    ];
  }

  name() {
    return "ProductTypeQuestions";
  }

  ProductTypeQuestions() {
    const Answers = new ProductTypeAnswers();
    return {
      Answers,
    };
  }
}
