"use strict";

const express = require("express");
const router = express.Router();
const commentController = require("../../controllers/comment.controller");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");

// authentication
router.use(authentication);
//
router.post("", asyncHandler(commentController.createComment));
router.get("", asyncHandler(commentController.getCommentsByParentId));
router.delete("", asyncHandler(commentController.deleteComment));

module.exports = router;
