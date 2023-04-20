const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Plase write your name!"],
    },
    email: {
        type: String,
        required: [true, "Plase write your email!"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email address!"]
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password!"],
        validate: {
            validator: function (el) {
                return el === this.password; 
            },
            message: "Passwords do not match"
        }
    }
})

userSchema.pre("save", async function (next) {
    // Only run this function if passowrd was actually modified
    if(!this.isModified("password")){
        return next();
    }

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)

    // Delete passwordConfirm
    this.passwordConfirm = undefined;
    next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;