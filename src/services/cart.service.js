"use strict";

const { NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

/*
  - add product to cart (user)
  - reduce product quantity by one (user)
  - increase product quantity by one (user)
  - get cart (user)
  - delete cart (user)
  - delete cart item (user)
*/

class CartService {
  // START REPO CART //
  static async createUserCart({ userId, product = {} }) {
    const query = { cart_userId: +userId, cart_state: "active" };
    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product = {} }) {
    const { productId, quantity } = product;
    const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    };
    const updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };

    return await cart.findOneAndUpdate(query, updateSet, options);
  }
  // END REPO CART//
  static async addToCart({ userId, product = {} }) {
    // check cart ton tai hay k?
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      // create cart for user
      return await CartService.createUserCart({ userId, product });
    }

    // new co gio hang roi nhung chua co san pham thì sao?
    console.log(userCart);
    if (!userCart.cart_products.length) {
      userCart.cart_products.push(product);
      return await userCart.save();
    }

    // gio hang ton tai, và co san pham nay thi update quantity
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  // update cart
  /*
    shop_order_ids: [
      {
        shopId,
        item_products: [
          {
            quantity,
            price,
            shopId,
            old_quantity,
            productId
          }
        ],
        version
      }
    ]
  */
  static async addToCartV2({ userId, shop_order_ids = [] }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    const foundProduct = await getProductById(productId);

    if (!foundProduct)
      throw new NotFoundError("Not found product with id: ", productId);

    //compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("Product not belong to the shop");
    }

    if (quantity === 0) {
      // delete
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" };
    const updateSet = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };
    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;