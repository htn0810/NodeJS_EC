"use strict";

const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  //  new
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Add to cart successfully!",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  // update + -
  update = async (req, res, next) => {
    new SuccessResponse({
      message: "Updae cart successfully!",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  // delete
  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete cart successfully!",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  // list carts
  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "List cart successfully!",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
