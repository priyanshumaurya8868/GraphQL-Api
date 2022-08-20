const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const app = express();
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");
const fs = require("fs");

var { graphqlHTTP } = require("express-graphql");
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

  // The problem is express graphql automatically declines anything which is not a post or get request,
  // so the options request is denied.
  // & browser  sends  options req before every post or put req
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
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

app.use(require("./middleware/auth"));

//there is no specific way to upload image in graphQl we have embeded this  endpoint in somewhere in frontend
app.put("/post-image", (req, res, next) => {
  if (!req.isAuth) {
    throw new Error("Not Authenticated!");
  }
  if (!req.file) {
    return res.status(200).json({ message: "no new file provided!" });
  }

  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  console.log("og : "+ req.file.path)
  const imageUri = req.file.path.replace("\\", "/");
  console.log("imageUri : "+ imageUri)
  return res
    .status(201)
    .json({ message: "File stored", filePath: imageUri });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

app.use((err, req, res, next) => {
  console.log(err);
  console.log(err.message);
  console.log(err.data);
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

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

// npm i express-graphql graphql --save
