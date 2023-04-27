const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tour/tourModel");
const User = require("./../../models/user/userModel");
const Review = require("./../../models/review/reviewModel");

dotenv.config({path: "./config.env"});

const database = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(database, {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connection successful");
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"));

//IMPORT DATA INTO DB
const importData = async () => {
    try{
        await Tour.create(tours)
        await User.create(users)
        await Review.create(reviews)
        console.log("Data successfully loaded");
    }catch (error) {
        console.log(error)
    }
}

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log("Data successfully deleted");
    }catch (error) {
        console.log(error)
    }
}

if(process.argv[2] === "--import"){
    importData();
} else if(process.argv[2] === "--delete") {
    deleteData();
}

console.log(process.argv)
