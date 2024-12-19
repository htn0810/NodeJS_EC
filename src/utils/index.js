"use strict";
const _ = require("lodash");
const { Types } = require("mongoose");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (
      typeof obj[key] === "object" &&
      !Array.isArray(obj[key]) &&
      obj[key] !== null &&
      obj[key] !== undefined
    ) {
      removeUndefinedObject(obj[key]);
    }
    if (obj[key] == null || obj[key] == undefined) {
      delete obj[key];
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj, parent, result = {}) => {
  console.log("old obj: ", obj);
  Object.keys(obj).forEach((k) => {
    const propName = parent ? `${parent}.${k}` : k;
    if (typeof obj[k] == "object" && !Array.isArray(obj[k])) {
      updateNestedObjectParser(obj[k], propName, result);
    } else {
      result[propName] = obj[k];
    }
  });
  console.log("new obj: ", result);
  return result;
};

const convertToObjectIdMongoDb = (id) => new Types.ObjectId(id);

const unselectFields = (fields) => fields.map((field) => `-${field}`).join(" ");

module.exports = {
  getInfoData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongoDb,
  unselectFields,
};
