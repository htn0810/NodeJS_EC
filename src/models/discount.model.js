"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

// Declare the Schema of the Mongo model
var discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      required: true,
      enum: ["percentage", "fixed_amount"],
      default: "fixed_amount",
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      type: Number,
      required: true,
    },

    // Số discount đã sử dụng
    discount_uses_count: {
      type: Number,
      required: true,
    },

    // Ai đã sử dụng discount
    discount_user_used: {
      type: Array,
      default: [],
    },

    // số lượng cho phép tối đa 1 user sử dụng
    discount_max_uses_per_user: {
      type: Number,
      required: true,
    },

    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },

    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },

    // Sản phẩm áp dụng discount khi discount_applies là specific
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = {
  discount: model(DOCUMENT_NAME, discountSchema),
};
