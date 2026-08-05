// import { db } from "./db/handler.js";

import { dropTable } from "./db/handler.js";

// main();

// testing IS TABLE OF factory function
/*
TYPE scactable IS TABLE OF g_scac_record
  INDEX BY BINARY_INTEGER;
*/

// equivalent of TABLE OF declaration

// const g_scac_recordFactory = (scac_code, carrier_name) => ({
//   scac_code,
//   carrier_name,
// });

//   return {
//     org_code: mtl_parameters.organization_code % YPE,
//   };
// }

/*
This option allows for methods on Object. Downside is there are more steps to get the same data
const createScacTable = (intitialData = []) => {
  const collection = [...intitialData];

  return {
    all: () => collection,

    add: (scac_code, carrier_name) => {
      collection.push(g_scac_recordFactory(scac_code, carrier_name));
    },

    count: () => collection.length,

    get: (index) => collection[index],
  };
};

const scactable = createScacTable();
scactable.add("AJT", "Alpha John Trucks");
scactable.add("TSR", "Transportation Services");
console.log(scactable.get(0));

[
  { scac_code: "AJT", carrier_name: "Alpha John Trucks" },
  { scac_code: "TSR", carrier_name: "Transportation Services" },
];
*/
/////////////////

//

// function g_scac_recordFactory(scac_code, carrier_name) {
//   return {
//     scac_code,
//     carrier_name,
//   };
// }

// const scacRecords = [
//   {
//     scac_code: "AJT",
//     carrier_name: "Alpha John Trucks",
//   },
//   {
//     scac_code: "TSR",
//     carrier_name: "Transportation Services",
//   },
// ];

// const scactable = scacRecords.map((record) =>
//   g_scac_recordFactory(record.scac_code, record.carrier_name),
// );

// function createScacTable(scacRecords) {
//   const scactable = scacRecords.map((record) =>
//     g_scac_recordFactory(record.scac_code, record.carrier_name),
//   );
//   return scactable;
// }

// let scactable = createScacTable(scacRecords);
// console.log(scactable);

// console.log(scacRecords);

// scacRecords.push({
//   scac_code: "CHI",
//   carrier_name: "Chicago Transport",
// });

// function updateScacTable({ scac_code: scac_code, carrier_name: carrier_name }) {
//   scacRecords.push({
//     scac_code,
//     carrier_name,
//   });
//   return createScacTable(scacRecords);
// }

// console.log(
//   updateScacTable({ scac_code: "CHI", carrier_name: "Chicago Transport" }),
// );

/*
this returns
[
  { scac_code: 'AJT', carrier_name: 'Alpha John Trucks' },
  { scac_code: 'TSR', carrier_name: 'Transportation Services' }
]
  */

/*
function scactableFactory() {
  return [];
}
const scactable = scactableFactory();

scactable[0] = {
  scaccode: "AJT",
  description: "Aplha Jonn Trucks",
};
scactable[1] = {
  scaccode: "TSR",
  description: "Transportation Services",
};
console.log(scactable);
//
This returns
[
  { scaccode: 'AJT', description: 'Aplha Jonn Trucks' },
  { scaccode: 'TSR', description: 'Transportation Services' }
]
  */

function tableTest() {
  const del = db.prepare(`DROP TABLE IF EXISTS scactable`);
  del.run();
  try {
    const result = db.exec(
      `CREATE TABLE scactable(scac_code TEXT PRIMARY KEY, carrier_name TEXT) STRICT`,
    );
    const query = db.prepare("SELECT * FROM scactable");
    console.log(query.all());
  } catch (err) {
    console.log("err", err.message);
  }
}

// tableTest();

const test = dropTable("test");

// const insert = db.prepare(
//   `INSERT INTO scactable (scac_code, ca`rrier_name) VALUES (?, ?)`,
// );

// insert.run("PRIJ", "Prime Logistics");

// const query = db.prepare("SELECT * FROM scactable");

// console.log(query.all());
