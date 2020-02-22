// dotenv module for read .env variables
require("dotenv").config();
import router from "./router";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

const app = express();
const port = process.env.API_PORT || 3000;

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
// import api routes
app.use("/api", router);

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
