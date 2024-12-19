"use strict";

const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/cart.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.get("", asyncHandler(cartController.listToCart));
router.post("/update", asyncHandler(cartController.update));

// authentication
// router.use(authentication);
//
router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.delete));

module.exports = router;
