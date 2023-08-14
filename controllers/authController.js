// Dependencies
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail.js");
const User = require("../models/User");

/*
 *  @Desc register new user
 *  @Route POST /api/auth/signup
 *  @Access public
 */
const registerUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    // Generate a verification code
    const verificationCode = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const hashedVerificationCode = crypto
        .createHash("sha256")
        .update(verificationCode)
        .digest("hex");

    console.log(hashedVerificationCode, verificationCode);
    // Save the hashed verification code in the database
    user.verificationCode = hashedVerificationCode;
    // Add expiration time to the verification code (10 minutes)
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;

    user.isEmailVerified = false;
    user.flag = false;

    await user.save();

    // 3- Send the verification code via email
    const message = `Hi, ${user.name},\n\nWe need to confirm your email address you used in the registration.\n\n Please use this code: ${verificationCode}\n\n`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Confirm your email address",
            message,
        });
        res.status(200).json({
            status: "success",
            message: "Verification code sent to your email",
        });
    } catch (err) {
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        user.flag = undefined;
        user.isEmailVerified = false;

        await user.save();

        return next(
            new ApiError(
                "There is an error in sending email, please try again later",
                500
            )
        );
    }
    return res.status(201).json({ data: user });
});

/*
 * @Desc Verify email address used for registration
 * @Route POST /api/auth/verifyEmail
 * @Access public
 */
const verifyEmail = asyncHandler(async (req, res, next) => {
    // 1- Get the user depending on the verification code
    const hashedVerificationCode = crypto
        .createHash("sha256")
        .update(req.body.verificationCode)
        .digest("hex");

    const user = await User.findOne({
        verificationCode: hashedVerificationCode,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ApiError("Verification code invalid or expired", 401));
    }

    // verification code valid
    user.flag = true;
    user.isEmailVerified = true;

    await user.save();

    res.status(200).json({
        status: "Account confirmed",
    });
});

// Export module
module.exports = { registerUser, verifyEmail };
