const express = require("express");
require("dotenv").config();
const { model } = require("mongoose");
const app = express();

app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;
