const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const app = express();
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");

var { graphqlHTTP } = require('express-graphql');
// const { graphqlHttp } = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

app.use(morgan("dev"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + ".png");
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true); //for acceptance
  } else {
    cb(null, false); // rejection
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
// application/json
app.use(bodyParser.json());
app.use(
  multer({
    storage: storage,
    fileFilter: fileFilter,
  }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  })
);

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect("mongodb://localhost:27017/soshu")
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));

// npm i express-graphql graphql --save