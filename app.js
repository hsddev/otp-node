// Dependencies
const express = require("express");
const dotenv = require("dotenv");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const routes = require("./routes/");

const app = express();
dotenv.config({});
const PORT = process.env.PORT;
app.use(express.json());

app.use(routes);

// Handle unhanding routes and send the error to the error middleware
app.all("*", (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

// Mongodb connection
dbConnection();

app.listen(PORT, (req, res) => {
    console.log(`Start listening on ${PORT}`);
});
