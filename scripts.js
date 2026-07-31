// import { pool } from "./db/pool.js";
// import { Client } from "pg";
// import "dotenv/config";

// const scac_codes = `
//   "AAE2",
//   "AACT",
//   "ACEH",
//   "AMFF",
//   "AH12",
//   "ASSM",
//   "BTAG",
//   "BEA6",
//   "CBER",
//   "BLA8",
//   "BXNT",
//   "BOY1",
//   "BRNC",
//   "BEXE",
//   "BST1",
//   "CGT1",
//   "CBKD",
//   "CO95",
//   "CNWY",
//   "CNHD",
//   "CYPR",
//   "DEAW",
//   "DAYE",
//   "DGAM",
//   "DBAF",
//   "DEVR",
//   "DIXD",
//   "EWWY",
//   "FAIR",
//   "FDE",
//   "FXST",
//   "FRET",
//   "FR54",
//   "GREO",
//   "GTKN",
//   "HTUK",
//   "SHAY",
//   "HAW6",
//   "HIOT",
//   "HBTN",
//   "HORN",
//   "HUNA",
//   "ICCI",
//   "JDEL",
//   "REEJ",
//   "JOUR",
//   "KPLN",
//   "TAKF",
//   "MAD2",
//   "MSUT",
//   "MSIL",
//   "MADL",
//   "MAV1",
//   "MWLK",
//   "MTL1",
//   "MTLA",
//   "MCET",
//   "METE",
//   "MLXP",
//   "NPME",
//   "OPTT",
//   "PVT1",
//   "PIM1",
//   "PNOQ",
//   "PRIJ",
//   "PRTR",
//   "QNGF",
//   "RNTC",
//   "RFTC",
//   "ROEV",
//   "RSDL",
//   "RSGL",
//   "SNMT",
//   "SLPN",
//   "SHBR",
//   "SHIF",
//   "SQCH",
//   "SILO",
//   "SILL",
//   "SODV",
//   "SERJ",
//   "SMTL",
//   "STLO",
//   "SBTQ",
//   "SYTP",
//   "TAYL",
//   "TFEJ",
//   "TWHS",
//   "TGT2",
//   "TMCD",
//   "TMOT",
//   "TOTE",
//   "TFFC",
//   "TPCN",
//   "TSBC",
//   "FAR8",
//   "TWEI",
//   "UPGF",
//   "WRTN",
//   "WSXI",
//   "WCLH",
//   "WOER",
//   "WO28",
//   "WBTT",
//   "RDWY",
//   "ZANS",
// `;

// const names = `
//   "A & A EXPRESS, LLC",
//   "AAA COOPER TRANSPORTATION",
//   "ACE DORAN HAULING & RIGGING CO",
//   "AMERICAN FAST FREIGHT",
//   "ANNETT HOLDINGS, INC.",
//   "ATS SPECIALIZED INC",
//   "BEAR TRANSPORTATION SERVICES LP",
//   "BEARDEN TRANSPORTATION/WALLACE CO, INC.",
//   "BERTIS CARLSON TRUCKING, INC.",
//   "BLACKHAWK TRANSPORT, INC.",
//   "BOOTS TRANSPORTATION",
//   "BOYD BROS. TRANSPORTATION INC.",
//   "BRONCO",
//   "BRYAN'S EXPRESS",
//   "BST TRANSPORTATION, LLC-- LISTED UNDER FARMER TRUCKING",
//   "C&G TRUCKING CO.",
//   "CIRCLE B INC.",
//   "COMMODITY TRANSPORTERS",
//   "CON-WAY FREIGHT",
//   "CUNHA DRAYING, INC.",
//   "CYPRESS TRUCK LINES, INC.",
//   "D&S LOGISTICS, INC.",
//   "DAILY EXPRESS INC",
//   "DAN GAMACHE",
//   "DBA DISTRIBUTION SERVICES",
//   "DEBRICK TRUCK LINE COMPANY",
//   "DIXIE DUMPTRUCKING/PORTER CAPITAL CORP",
//   "E W WYLIE CORPORATION",
//   "FAIRWAY TRANSPORTATION SERVICES LTD",
//   "FEDERAL EXPRESS",
//   "FOX'S TRANSPORT LTD",
//   "FREIGHT TECH",
//   "FREMONT EXPRESS",
//   "GFS TRANSPORTATION, INC",
//   "GLS TRUCKING,LLC/CENTURY FINANCE LLC",
//   "H. TRUCKING",
//   "HARRY SCHNEIDER TRUCKING, INC.",
//   "HAWK TRUCK LEASING/RTS FINANCIAL SERVICE",
//   "HI OCEAN TRANSPORT",
//   "HORNADY TRANSPORTATION, LLC",
//   "HORNSBY EXPRESS INC",
//   "HUNT TRANSPORTATION INC",
//   "ICE CASTLES, INC.",
//   "JD DELIVERY SERVICE INC",
//   "JOHN R REED INC",
//   "JOURNEY FREIGHT",
//   "KAPLAN TRUCKING",
//   "KARRGO FREIGHT SYSTEMS INC",
//   "MADRIGAL TRUCKING",
//   "MANSUR TRUCKING, INC.",
//   "MARISOL INTERNATIONAL LLC",
//   "MASON DIXON LINES, INC.",
//   "MAVERICK LOGISTICS, LLC",
//   "MEADOW LARK AGENCY, INC.",
//   "MELTON LOGISTICS,LLC.",
//   "MELTON TRUCK LINES INC.",
//   "MERCER TRANSPORTATION",
//   "METEOR EXPRESS",
//   "MILAN EXPRESS CO INC.",
//   "NEW PENN MOTOR EXPRESS",
//   "OPTIMUS TRANSPORT",
//   "P V T TRANSPORTATION, INC.",
//   "PI&I MOTOR FREIGHT,INC.",
//   "PINOLE VALLEY TRUCKING, INC.",
//   "PRIME INC.",
//   "PRIMOS TRANSPORTE INC",
//   "Q-LINE TRUCKING",
//   "R & N TRUCKING CO INC",
//   "R.F. TRUCKING OF DANE CO., LLC",
//   "ROEHL TRANSPORT, INC.",
//   "ROSEDALE TRANSPORT INC.",
//   "RS GILL",
//   "SANTIAM TRANSPORT INC",
//   "SCHILLI TRANSPORTATION SERV/T.A.B.",
//   "SHERMAN BROTHERS",
//   "SHIFFLETT",
//   "SHIPPERS CHOICE TRANSPORTATION LLC",
//   "SILO TRUCKING",
//   "SILVERLINING",
//   "SOUND DELIVERY SERVICE INC",
//   "SOUTHEAST SPECIALTY HAULERS",
//   "SOUTHWESTERN MOTOR TRANSPORT INC",
//   "STOUGHTON LOGISTICS, LLC",
//   "SUNBELT TRANSPORT, INC.",
//   "SYSTEM TRANSPORT INC",
//   "TAYLOR MADE EXPRESS",
//   "TERRY FEIJO TRUCKING LLC",
//   "TERRY WARD HOT SHOT",
//   "TG TRANSPORT/INTERSTATE CAPITAL CORP",
//   "TMC TRANSPORTATION",
//   "TOM MOORE TRANSPORT",
//   "TOTEM OCEAN TRAILER EXPRESS, INC.",
//   "TRAFFIC TECH INC",
//   "TRANSPORT CONTINENTAL INC",
//   "TRANSPORT DISTRIBUTION COMPANY",
//   "TRIPLE S TRANSPORT---FORMER FARMER TRUCKING",
//   "TUMBLEWEED EXPRESS INC",
//   "UPS FREIGHT D/B/A UPS GROUND FREIGHT.INC",
//   "WARRIOR TRANSPORT",
//   "WESTERN EXPRESS, INC.",
//   "WINDCHASER CARRIER LOGISTICS INC.",
//   "WOERPEL TRUCKING, INC",
//   "WORRELL EXPRESS, LLC",
//   "WTI TRANSPORT, INC.",
//   "YRC INC",
//   "Z & S",
// `;

// `INSERT INTO carriers (scac, name)
// VALUES
// ('', 'AAE2111111072226');`;

// async function populateCarriers(scac_codes, names) {
//   try {
//     console.log("seeding...");
//     const client = new Client({
//       connectionString: process.env.DB_STRING,
//     });
//     await client.connect();
//     await client.query();
//     console.log("success");
//   } catch (err) {
//     console.log("there was an error", err);
//   }
// }

// populateCarriers();

// async function main() {
//   try {
//     console.log("seeding...");
//     const client = new Client({
//       connectionString: process.env.DB_STRING,
//     });
//     await client.connect();
//     // await client.query(SQL);
//     await client.end();
//     console.log("done");
//   } catch (err) {
//     console.log(err);
//   }
// }

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

function g_scac_recordFactory(scac_code, carrier_name) {
  return {
    scac_code,
    carrier_name,
  };
}

const scacRecords = [
  {
    scac_code: "AJT",
    carrier_name: "Alpha John Trucks",
  },
  {
    scac_code: "TSR",
    carrier_name: "Transportation Services",
  },
];

// const scactable = scacRecords.map((record) =>
//   g_scac_recordFactory(record.scac_code, record.carrier_name),
// );

function createScacTable(scacRecords) {
  const scactable = scacRecords.map((record) =>
    g_scac_recordFactory(record.scac_code, record.carrier_name),
  );
  return scactable;
}

let scactable = createScacTable(scacRecords);
console.log(scactable);

// console.log(scacRecords);

// scacRecords.push({
//   scac_code: "CHI",
//   carrier_name: "Chicago Transport",
// });

function updateScacTable({ scac_code: scac_code, carrier_name: carrier_name }) {
  scacRecords.push({
    scac_code,
    carrier_name,
  });
  return createScacTable(scacRecords);
}

console.log(
  updateScacTable({ scac_code: "CHI", carrier_name: "Chicago Transport" }),
);

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

// function g_shipping_order_details_recFactory(
//   sequence_no,
//   cont_name,
//   linedescription,
//   header_desc,
//   order_number,
//   ship_set_name,
//   customer_name,
//   ship_from_org_code,
//   category,
//   transaction_type,
//   gross_weight,
//   requested_quantity,
//   truck,
//   project_name,
//   cust_po_number,
//   plant_info_sup,
//   quantity_picked,
//   backordered_quantity,
//   extended_wt_sup,
//   part_number_sup,
//   staged_truck_id,
// ) {
//   return {
//     sequence_no,
//     cont_name, //100 char limit
//     linedescription, // 250 limit
//     header_desc, //            'VARCHAR2(100)',
//     order_number,
//     ship_set_name, //          'VARCHAR2(100)',
//     customer_name, //          'VARCHAR2(100)',
//     ship_from_org_code, //     VARCHAR2(10),
//     category, //               VARCHAR2(100),
//     transaction_type, //       VARCHAR2(100),
//     gross_weight,
//     requested_quantity,
//     truck, //                  VARCHAR2(100),
//     project_name, //           VARCHAR2(240),
//     cust_po_number, //        VARCHAR2(50),
//     plant_info_sup, //         VARCHAR2(3),
//     quantity_picked,
//     backordered_quantity,
//     extended_wt_sup,
//     part_number_sup, // VARCHAR2(40),
//     staged_truck_id, // VARCHAR2(20)
//   };
// }

// const shippingOrderDetails = [
//   {
//     sequence_no: 123456789,
//     cont_name: "1AT",
//     linedescription: "4ftgr",
//     header_desc: "N/A",
//     order_number: 260014145,
//     ship_set_name: "direct",
//     customer_name: "Bluescope",
//     ship_from_org_code: "ANN",
//     CATEGORY: "Structural",
//     transaction_type: "purchased",
//     gross_weight: 8000,
//     requested_quantity: 20,
//     project_name: "TEST",
//     cust_po_number: "123f344as3f",
//     plant_info_sup: "Charles Beef",
//     quantity_picked: 20,
//     backordered_quantity: 0,
//     part_number_sup: "234fef",
//     staged_truck_id: "2349234805t1",
//   },
//   {
//     sequence_no: 22319784,
//     cont_name: "30M",
//     linedescription: "12313sf",
//     header_desc: "N/A",
//     order_number: 194567951,
//     ship_set_name: "direct",
//     customer_name: "ACME",
//     ship_from_org_code: "STJ",
//     CATEGORY: "Design",
//     transaction_type: "sold",
//     gross_weight: 20000,
//     requested_quantity: 300,
//     project_name: "TEST2",
//     cust_po_number: "234asdf44as3f",
//     plant_info_sup: "John Stamos",
//     quantity_picked: 300,
//     backordered_quantity: 2,
//     part_number_sup: "23490sdg",
//     staged_truck_id: "44198911231T1",
//   },
// ];

// function g_shipping_order_detailsFactory(shippingOrderDetails) {
//   const g_shipping_order_details_table = shippingOrderDetails.map((record) =>
//     g_shipping_order_details_recFactory(
//       record.sequence_no,
//       record.cont_name,
//       record.linedescription,
//       record.header_desc,
//       record.order_number,
//       record.ship_set_name,
//       record.customer_name,
//       record.ship_from_org_code,
//       record.category,
//       record.transaction_type,
//       record.gross_weight,
//       record.requested_quantity,
//       record.project_name,
//       record.cust_po_number,
//       record.plant_info_sup,
//       record.quantity_picked,
//       record.backordered_quantity,
//       record.extended_wt_sup,
//       record.part_number_sup,
//       record.staged_truck_id,
//     ),
//   );
//   return g_shipping_order_details_table;
// }

// const g_shipping_order_details_table =
//   g_shipping_order_detailsFactory(shippingOrderDetails);

// console.log(g_shipping_order_details_table[0]);
