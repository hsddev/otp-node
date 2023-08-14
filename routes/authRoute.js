// Dependencies
const router = require("express").Router();
const { registerUser, verifyEmail } = require("../controllers/authController");
const { createUserValidator } = require("../utils/validators/authValidator");

router.post("/signup", createUserValidator, registerUser);
router.post("/verifyEmail", verifyEmail);

// Export module
module.exports = router;
