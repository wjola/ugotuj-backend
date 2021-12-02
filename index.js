const express = require("express");
require("dotenv").config(); // https://www.npmjs.com/package/dotenv
const connectDB = require("./dbConfig.js");
const cors = require("cors");
const aws = require("aws-sdk");

// Tworzymy server
const app = express();

// Łączymy się z bazą danych
connectDB();

// Middleware
app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);
app.use(cors());

// Pobieramy routery
const recipeRouter = require("./routers/recipe.router");

// Rejestrujemy routery
app.use(recipeRouter);

aws.config.region = process.env.AWS_REGION;

const PORT = process.env.PORT || 5000;

// Ustawiamy nasłuchiwanie na serverze
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
