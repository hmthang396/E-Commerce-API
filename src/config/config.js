
const dotenv = require("dotenv")
dotenv.config();
module.exports = {
  "test": {
    "username": process.env.DB_TEST_USERNAME,
    "password": process.env.DB_TEST_PASSWORD,
    "database": process.env.DB_TEST_DATABASE,
    "host": process.env.DB_TEST_HOST,
    "dialect": process.env.DB_TEST_DIALECT,
    "port" : process.env.DB_TEST_PORT,
    "logging" : true,
  },
  "development": {
    "username": process.env.DB_DEVELOPMENT_USERNAME,
    "password": process.env.DB_DEVELOPMENT_PASSWORD,
    "database": process.env.DB_DEVELOPMENT_DATABASE,
    "host": process.env.DB_DEVELOPMENT_HOST,
    "dialect": process.env.DB_DEVELOPMENT_DIALECT,
    "port" : process.env.DB_DEVELOPMENT_PORT,
    "logging" : true
  },
  "production": {
    "username": process.env.DB_PRODUCTION_USERNAME,
    "password": process.env.DB_PRODUCTION_PASSWORD,
    "database": process.env.DB_PRODUCTION_DATABASE,
    "host": process.env.DB_PRODUCTION_HOST,
    "dialect": process.env.DB_PRODUCTION_DIALECT,
    "port" : process.env.DB_PRODUCTION_PORT,
    "logging" : true
  }
}
