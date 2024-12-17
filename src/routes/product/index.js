"use strict";

const express = require("express");
const router = express.Router();
const productController = require("../../controllers/product.controller");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProducts)
);
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:product_id", asyncHandler(productController.findProduct));

// authentication
router.use(authentication);
//
router.post("", asyncHandler(productController.createNewProduct));
router.patch("/:productId", asyncHandler(productController.updateProduct));
router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unpublishProductByShop)
);

router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;
