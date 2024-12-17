"use strict";

const ProductService = require("../services/product.service");
const ProductServicePro = require("../services/product.service.pro");
const { SuccessResponse } = require("../core/success.response");

class ProductController {
  // createNewProduct = async (req, res, next) => {
  //   new SuccessResponse({
  //     message: 'Create product successfully!',
  //     metadata: await ProductService.createProduct(req.body.product_type, {...req.body, product_shop: res.user.userId})
  //   }).send(res);
  // }

  createNewProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create product successfully!",
      metadata: await ProductServicePro.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // update product
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update product successfully!",
      metadata: await ProductServicePro.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Published product successfully!",
      metadata: await ProductServicePro.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  unpublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Un-published product successfully!",
      metadata: await ProductServicePro.unpublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all Drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @param {Id} shopId
   * @return {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list draft products successfully!",
      metadata: await ProductServicePro.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list draft products successfully!",
      metadata: await ProductServicePro.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list draft products successfully!",
      metadata: await ProductServicePro.searchProducts(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list products successfully!",
      metadata: await ProductServicePro.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get product successfully!",
      metadata: await ProductServicePro.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
