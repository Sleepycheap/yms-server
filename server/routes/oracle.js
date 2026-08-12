import express from "express";
import {
  testConnection,
  GetOrgCode,
  GetScac,
  GetTrucks,
  GetProductQuestionaireResponse,
  GetProductAnswersResponse,
  GetProductTypeResponse,
  GetCatProdTypeRel,
} from "../oracle/oracleQueries.js";

const oracleRouter = express.Router();

oracleRouter.get("/", (req, res) => {
  res.status(200).json("Hello from node");
});

oracleRouter.get("/health", async (req, res) => {
  const response = await testConnection();
  if (res.statusCode === 200) {
    return `Connection to Oracle is healthy`;
  } else {
    return `Connection to Oracle is unhealthy`;
  }
  // console.log("response", response);
});

oracleRouter.get("/orgcode", async (req, res) => {
  try {
    let output = [];
    const response = await GetOrgCode();
    for (let i = 0; i < response.length; i++) {
      output.push(response[i].ORGANIZATION_CODE);
    }
    res.json({ "Organization Codes": output });
    return output;
  } catch (err) {
    res.json(err.message);
  }
});

oracleRouter.get("/scacCode", async (req, res) => {
  try {
    const response = await GetScac();
    res.json({ "SCAC Codes": response });
    return response;
  } catch (err) {
    res.json(err.message);
  }
});

oracleRouter.get("/trucks", async (req, res) => {
  try {
    const { org_code } = req.query;
    const response = await GetTrucks(org_code);
    res.json(response);
    return response;
  } catch (err) {
    res.json(err.message);
  }
});

oracleRouter.get("/productquestions", async (req, res) => {
  try {
    const response = await GetProductQuestionaireResponse();
    res.json(response);
    return response;
  } catch (err) {
    res.json(err.message);
  }
});

oracleRouter.get("/productanswers", async (req, res) => {
  try {
    const response = await GetProductAnswersResponse();
    res.json(response);
    return response;
  } catch (err) {
    res.json(err.message);
  }
});

oracleRouter.get("/product_type", async (req, res) => {
  try {
    const response = await GetProductTypeResponse();
    res.json(response);
    return response;
  } catch (err) {
    res.json(err.message);
  }
});

oracleRouter.get("/product_type_rel", async (req, res) => {
  try {
    const response = await GetCatProdTypeRel();
    res.json(response);
    return response;
  } catch (err) {
    res.json(err.message);
  }
});

// oracleRouter.get("/:table", async (req, res) => {
//   try {
//     const table = req.params.table;
//     const response = await getTable(table);
//     console.log("tables:", response);
//     // response.rows.forEach((row) => {
//     //   console.log(row[0]);
//     // });
//     res.json({ tables: response });
//   } catch (err) {
//     res.json("ERROR", err);
//     console.log("ERROR", err);
//   }
// });

export default oracleRouter;
