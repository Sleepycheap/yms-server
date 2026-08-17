/*
This file is the source of the local SQLite database, and stores its connection therein.
The database path is a env variable for security, and an easier connection process.
*/

import Database from "better-sqlite3";
import dotenv from "dotenv";
dotenv.config({ path: "../server/.env" });

export const db = new Database(process.env.SQL_DATABASE);
