"use strict";

const { SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  //  new
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: "Add to cart successfully!",
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };

  // // update + -
  // update = async (req, res, next) => {
  //   new SuccessResponse({
  //     message: "Updae cart successfully!",
  //     metadata: await CartService.addToCartV2(req.body),
  //   }).send(res);
  // };
}

module.exports = new CheckoutController();
