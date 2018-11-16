"use strict";
const ENV = process.env.ENV || "development";

(ENV === "development") && require('dotenv').config();

const PORT = process.env.PORT || 8080;

const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();

const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);

const query = require("../db/queries")(knex);

const routes = require("../routes/routes");



if (ENV === "development") {

  const morgan = require('morgan');
  const knexLogger = require('knex-logger');

  console.log("starting in dev environment");
  // Load the logger first so all (static) HTTP requests are logged to STDOUT
  // 'dev' = Concise output colored by response status for development use.
  //         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
  app.use(morgan('dev'));

  // Log knex SQL queries to STDOUT as well
  app.use(knexLogger(knex));

}



const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: 'session',
  keys: ['secret', 'anothersecret', 'andanothersecret'],
  maxAge: 24 * 60 * 60 * 1000
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/", routes(knex, query));

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
