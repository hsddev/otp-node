const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createUserValidator = [
    body("firstName")
        .notEmpty()
        .withMessage("First name required")
        .isLength({ min: 3 })
        .withMessage("Too short first name"),
    body("lastName")
        .notEmpty()
        .withMessage("Last name required")
        .isLength({ min: 3 })
        .withMessage("Too short last name"),
    body("email")
        .notEmpty()
        .withMessage("Email required")
        .isEmail()
        .withMessage("Invalid email address"),
    body("username")
        .notEmpty()
        .withMessage("Username required")
        .isLength({ min: 6 })
        .withMessage("Too short username"),

    body("password")
        .notEmpty()
        .withMessage("Password required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .custom((pass, { req }) => {
            if (pass !== req.body.confirmPassword) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
    validatorMiddleware,
];
