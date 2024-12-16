"use strict";

const express = require("express");
const router = express.Router();
const productController = require("../../controllers/product.controller");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");

// authentication
router.use(authentication);
//
router.post("", asyncHandler(productController.createNewProduct));
router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);

router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;
