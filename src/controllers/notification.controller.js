"use strict";

const { SuccessResponse } = require("../core/success.response");
const { listNotiByUser } = require("../services/notification.service");

class NotiController {
  listNotiByuser = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list notifications by user",
      metadata: await listNotiByUser(req.query),
    }).send(res);
  };
}

module.exports = new NotiController();
