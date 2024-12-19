"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const {
  findAllDiscountCodesUnSelect,
  findOneDiscount,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectIdMongoDb } = require("../utils");

/*
  Discount Services
  1. - Generator Discount Code [Shop/Admin]
  2. - Get discount amount [User]
  3. - Get all discount codes [User/Shop]
  4. - Verify discount code [User]
  5. - Delete discount code [Shop/Admin]
  6. - Cancel discount code [Shop/Admin]
*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      users_used,
    } = payload;

    // kiemtra
    if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code has expired!");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be before end date!");
    }

    // create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongoDb(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount has existed!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_user_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscoundCode() {}

  // Get all discount code available with products
  static async getAllDiscountCodeWithProduct({ code, shopId, limit, page }) {
    // create index for discount_code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongoDb(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exist!");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      // get all products
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongoDb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      // get all products in list ids
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  // Get all discount code of Shop
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongoDb(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
    });

    return discounts;
  }

  // Apply discount code
  static async getDiscountAmount({ code, userId, shopId, products }) {
    const foundDiscount = await findOneDiscount({
      discount_code: code,
      discount_shopId: convertToObjectIdMongoDb(shopId),
    });

    if (!foundDiscount) throw new NotFoundError("Discount doesn't exist!");

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_start_date,
      discount_end_date,
      discount_user_used,
      discount_type,
      discount_value,
    } = foundDiscount;
    if (!discount_is_active) throw new NotFoundError("Discount expired!");
    if (!discount_max_uses)
      throw new NotFoundError("Discount is out of order!");
    if (
      new Date() > new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new NotFoundError("Discount expired!");
    }

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, totalOrder);

      console.log("Total order: ", totalOrder);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          "Minimum order price must be: ",
          discount_min_order_value
        );
      }
    }

    if (discount_max_uses > 0) {
      const userUseDiscount = discount_user_used.find(
        (user) => user.userId === userId
      );
      if (userUseDiscount) {
        //...
      }
    }

    // check xem discount la fixed_amount hay percentage;
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);
    console.log("Amount: ", amount);
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongoDb(shopId),
    });

    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await findOneDiscount({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongoDb(shopId),
    });

    if (!foundDiscount) throw new NotFoundError("Discount doesn't exist!");

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_user_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
