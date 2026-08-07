import { ProductTypeAnswers } from "./ProductTypeAnswers.js";
import { createTable } from "../db/handler.js";

export function ProductTypeQuestions() {
  return {
    name: "ProductTypeQuestions",
    columns: [
      "ProductTypeQuestionID INTEGER",
      "ProductTypeID INTEGER",
      "Question TEXT",
      "ProductTypeName TEXT",
    ],
    pk: "ProductTypeQuestionID",

    create: createTable(
      "ProductTypeQuestions",
      "ProductTypeQuestionID INTEGER, ProductTypeID INTEGER, Question TEXT, ProductTypeName TEXT",
    ),

    answers: ProductTypeAnswers(),
  };
}
console.log(ProductTypeQuestions.answers);
