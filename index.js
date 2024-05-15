'use strict'

const express = require("express");
const app = express();

//? Required modules and stuff

// envVariables;
require("dotenv").config();
const PORT = process.env?.PORT || 8000;
const HOST = process.env?.HOST || "127.0.0.1";

// async errors to error handler;
require("express-async-errors");

//? Configurations

const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

//? Middlewares

// accept JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());

// queryHandler
app.use(require("./src/middlewares/queryHandler"));

// Logger


// Authentication
app.use(require("./src/middlewares/authentication"));

//? Routes

// routes/index.js:
app.use("/", require("./src/routes/"));

// HomePath:
app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to HOTEL API",
  });
});

//? errorHandler
app.use(require("./src/middlewares/errorHandler"));

//? run server 
app.listen(PORT, () => console.log("HTTPS://"+ HOST+ ":" + PORT));

//? syncronization
// require('./src/helpers/sync')()   //!clearing database.