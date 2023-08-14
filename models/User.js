// Dependencies
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name required"],
    },
    lastName: {
        type: String,
        required: [true, "Last name required"],
    },
    username: {
        type: String,
        required: [true, "Username required"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email address required"],
    },
    password: {
        type: String,
        required: [true, "Password required"],
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: { type: String, default: null },
    verificationCodeExpires: {
        type: Date,
        default: null,
    },
    flag: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model("User", userSchema);

// Export module
module.exports = User;
