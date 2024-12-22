"use strict";

const express = require("express");
const router = express.Router();
const inventoryController = require("../../controllers/inventory.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

// authentication
router.use(authentication);
//
router.post("", asyncHandler(inventoryController.addStock));

module.exports = router;
