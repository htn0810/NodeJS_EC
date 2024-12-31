"use strict";

const express = require("express");
const router = express.Router();
const notiController = require("../../controllers/notification.controller");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");

// authentication
router.use(authentication);
//
router.get("", asyncHandler(notiController.listNotiByuser));

module.exports = router;
