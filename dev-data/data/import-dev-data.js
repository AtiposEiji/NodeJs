const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tour/tourModel");

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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"));

//IMPORT DATA INTO DB
const importData = async () => {
    try{
        await Tour.create(tours)
        console.log("Data successfully loaded");
    }catch (error) {
        console.log(error)
    }
}

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
    try{
        await Tour.deleteMany();
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
