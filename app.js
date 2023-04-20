const express = require('express');
const morgan = require('morgan');

const AppError = require("./utils/appError");
const globalErrorController = require("./controllers/error/errorController")
const tourRouter = require("./routes/tours/tourRouter");
const userRouter = require("./routes/users/userRouter");

const app = express();

// Middleware
if (process.env.NODE_ENV === "development") {
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

app.all("*", (req, res, next) => {
    // res.status(404).json({
    //     status: "fail",
    //     message: `Can't find ${req.originalUrl} on this server`
    // });

    // const err = new Error(`Can't find ${req.originalUrl} on this server`)
    // err.status = "fail";
    // err.statusCode = 404;
    
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
})

app.use(globalErrorController)

module.exports = app;