const express = require('express');
const morgan = require('morgan');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorController = require("./controllers/error/errorController")
const tourRouter = require("./routes/tours/tourRouter");
const userRouter = require("./routes/users/userRouter");
const reviewRouter = require("./routes/reviews/reviewRouter");

const app = express();

// Middleware
// SECURITY HTTP HEADERS
app.use(helmet());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// LIMITER OF REQUEST
// const limiter = rateLimit({
//     max: 100,
//     windowMs: 60 * 60 * 1000,
//     message: "Too many requests from this IP, please try again in an hour!" 
// });
// app.use("/api", limiter);

// Data Sanitization againt NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization againt XSS
app.use(xssClean());

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        "duration",
        "ratingsQuantity",
        "ratingsAverage",
        "maxGroupSize",
        "difficulty",
        "price"
    ]
}));

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
app.use("/api/v1/reviews", reviewRouter);

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