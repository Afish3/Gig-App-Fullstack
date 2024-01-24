"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

// URL for redirecting after successfull OAuth login
const FRONT_END_URL = process.env.FRONT_END_URL || "http://localhost:3000"

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "postgresql:///gigs-test"
      : process.env.DATABASE_URL || "postgresql:///gigs";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 13;

console.log("Gig Bears Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  FRONT_END_URL,
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
