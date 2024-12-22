"use strict";

const { convertToObjectIdMongoDb } = require("../../utils");
const { inventory } = require("../inventory.model");

const insertInventory = async ({ productId, shopId, stock, location }) => {
  return await inventory.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inven_productId: convertToObjectIdMongoDb(productId),
    inven_stock: { $gte: quantity },
  };
  const updateSet = {
    $inc: {
      inven_stock: -quantity,
    },
    $push: {
      inven_reservations: {
        quantity,
        cartId,
        createdAt: new Date(),
      },
    },
  };
  const options = { upsert: true, new: true };
  return await inventory.updateOne(query, updateSet, options);
};

module.exports = { insertInventory, reservationInventory };
