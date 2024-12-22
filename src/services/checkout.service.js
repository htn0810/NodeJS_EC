"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class CheckoutService {
  // Login & without Login
  /*
  {
    cartId,
    userId,
    shop_order_ids: [
      {
        shopId,
        shop_discount: [],
        item_products: [
          {
            price,
            quantity,
            productId
          }
        ]
      },
      {
        shopId,
        shop_discount: [
          {
            shopId,
            discountId,
            codeId
          }
        ],
        item_products: [
          {
            price,
            quantity,
            productId
          }
        ]
      }
    ]
  }
  */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    //  check cartId ton tai khong?
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError("Cart does not exist!");

    const checkout_order = {
      totalPrice: 0,
      freeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };

    const shop_order_ids_new = [];

    // tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      // check product available
      const checkProductServer = await checkProductByServer(item_products);
      console.log(checkProductServer);
      if (!checkProductServer[0]) throw new BadRequestError("Order wrong!");

      // tong tien don hang
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      // tong tien truoc khi xu ly
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      // new shop_discounts ton tai > 0, check xem co hop le hay k
      if (shop_discounts.length > 0) {
        // gia su chi co mot discount
        // get amout discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          code: shop_discounts[0].code,
          userId,
          shopId,
          products: checkProductServer,
        });

        // tong cong discount giam gia
        checkout_order.totalDiscount += discount;

        // neu tien giam gia lon hon 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  // order
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    // check lai mot lan nua xem vuot ton kho hay khong?
    // get new array Products
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log("Products: ", products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // check neu co mot san pham het hang trong kho
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Some Products were updated! Please turn back your cart..."
      );
    }

    const newOrder = order.create();
    return newOrder;
  }
}

module.exports = CheckoutService;
