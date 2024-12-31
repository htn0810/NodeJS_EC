"use strict";

const notiModel = require("../models/notification.model");

const pushNotiToSystem = async ({
  type = "SHOP-001",
  receivedId = 1,
  senderId = 1,
  options = {},
}) => {
  let noti_content;
  if (type === "SHOP-001") {
    noti_content = "HTN add new product: abc";
  } else if (type === "PROMOTION-001") {
    noti_content = "HTN add new voucher: xyz";
  }

  const newNoti = await notiModel.create({
    noti_type: type,
    noti_content,
    noti_senderId: senderId,
    noti_receivedId: receivedId,
    noti_options: options,
  });

  return newNoti;
};

const listNotiByUser = async ({ userId = 1, type = "ALL", isRead = 0 }) => {
  const match = { noti_receivedId: userId };
  if (type !== "ALL") {
    match["noti_type"] = type;
  }

  return await notiModel.aggregate([
    { $match: match },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_receivedId: 1,
        noti_content: 1,
        noti_options: 1,
        createdAt: 1,
      },
    },
  ]);
};

module.exports = {
  pushNotiToSystem,
  listNotiByUser,
};
