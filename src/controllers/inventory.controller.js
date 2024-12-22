"use strict";

const { SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  //  new
  addStock = async (req, res, next) => {
    new SuccessResponse({
      message: "Add to stock successfully!",
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  };
}

module.exports = new InventoryController();
