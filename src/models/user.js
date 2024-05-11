'use strict'

const { mongoose } = require("../configs/dbConnection");

const passwordEncrypt = require("../helpers/passwordEncrypt");

//? PASSWORD VALIDATOR
const validatePassword = function (pass) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return re.test(pass);
};

//? EMAIL VALIDATOR
const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

//? USER SCHEMA

const userSchema = new mongoose.Schema({
    // _id

    username: {
        type: String,
        trim: true,
        required: [true, "Username is required."],
        unique: true
    },

    email: {
        type: String,
        trim: true,
        required: [true, "E-mail is required."],
        validate: [
            validateEmail,
            "E-mail adress is invalid."
        ]
    },

    password: {
        type: String,
        trim: true,
        required: [true, "Password is required."],
        set: (password) => {
            if (validatePassword(password)) {
                return passwordEncrypt(password);
            } else {
                throw new Error(
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character and at least 8 characters in length"
                )
            };
        }
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },

    isStaff: {
        type: Boolean,
        default: false
    }

}, {
    collection: "users",
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);