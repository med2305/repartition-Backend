export {};
const path = require("path");

require("dotenv-safe").config({
  path: path.join(__dirname, "../../.env"),
  sample: path.join(__dirname, "../../.env.example"),
  allowEmptyValues: true,
});

const env = process.env;

module.exports = {
  port: env.PORT,
  mongoDbUri: env.MONGODBURL,
  tokenKey: env.TOKEN_KEY,
};
