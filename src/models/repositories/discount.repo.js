"use strict";

const { unselectFields } = require("../../utils");
const { discount } = require("../discount.model");

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const discounts = await discount
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unselectFields(unSelect))
    .lean();
  return discounts;
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const discounts = await discount
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean();
  return discounts;
};

const findOneDiscount = async (filter) => {
  const foundDiscount = await discount.findOne(filter).lean();
  return foundDiscount;
};

module.exports = { findAllDiscountCodesUnSelect, findOneDiscount };
