const express = require("express");
const router = express.Router();

const authController = require("../../controllers/AuthController");

/**
 * @route POST /api/auth/register
 * @desc Register a user to the db then return a token
 * @access Public
 */
router.route("/register").post(authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login a user and return a token
 * @access Public
 */
router.route("/login").post(authController.login);

module.exports = router;
