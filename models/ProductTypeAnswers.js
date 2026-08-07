import { createTable } from "../db/handler.js";

export function ProductTypeAnswers() {
  return {
    name: "ProductTypeAnswers",
    columns: [
      "ProductTypeAnswerID INTEGER",
      "ProductTypeQuestionID INTEGER",
      "Answer TEXT",
      "IsSelected INTEGER",
    ],
    pk: "ProductTypeAnswerID",

    create: createTable(
      "ProductTypeAnswers",
      "ProductTypeAnswerID INTEGER, ProductTypeQuestionID INTEGER, Answer TEXT, IsSelected INTEGER",
    ),
  };
}
