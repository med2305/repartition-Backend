import express from "express";
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

const routes = require("../routes");

const app = express();
app.use(express.text({ type: 'text/html' }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));

app.use(helmet());
app.use(cors());

app.use("/api/v1", routes);

module.exports = app;