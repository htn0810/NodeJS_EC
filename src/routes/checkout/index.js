"use strict";

const express = require("express");
const router = express.Router();
const checkoutController = require("../../controllers/checkout.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.post("/review", asyncHandler(checkoutController.checkoutReview));
// router.post("/update", asyncHandler(cartController.update));

// authentication
// router.use(authentication);
//
// router.post("", asyncHandler(cartController.addToCart));
// router.delete("", asyncHandler(cartController.delete));

module.exports = router;