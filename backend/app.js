const express = require("express");
require("dotenv").config();
const { model } = require("mongoose");
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow access to any domain
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  ); // Allow these headers
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  ); // Allow these methods

  next();
});

app.get("/api/posts", (req, res) => {
  const posts = [
    {
      id: "1",
      title: "First server-side post",
      content: "This is coming from the server",
    },
    {
      id: "2",
      title: "Second server-side post",
      content: "This is coming from the server!",
    },
    {
      id: "3",
      title: "Third server-side post",
      content: "This is coming from the server!!",
    },
  ];

  return res
    .status(200)
    .json({ message: "Post fetched successfully", posts: posts });
});

module.exports = app;
