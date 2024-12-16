"use strict";

const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");

// sign up
router.post("/shop/signup", asyncHandler(accessController.signUp));
// login
router.post("/shop/login", asyncHandler(accessController.login));

// authentication
router.use(authentication);

// logout
router.post("/shop/logout", asyncHandler(accessController.logout));
// handle refresh token
router.post(
  "/shop/handlerRefreshToken",
  asyncHandler(accessController.handlerRefreshToken)
);

module.exports = router;
