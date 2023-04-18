const express = require('express');
const morgan = require('morgan');

const tourRouter = require("./routes/tours/tourRouter");
const userRouter = require("./routes/users/userRouter");

const app = express();

// Middleware
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
}
app.use(express.json());

// Custom middleware
app.use((req, res, next) => {
    console.log("Hello from the middleware 😎");
    next();
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;