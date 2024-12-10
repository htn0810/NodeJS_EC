"use strict";

const mongoose = require("mongoose");

const connectString = `mongodb://localhost:27017/shopNode`;
mongoose
  .connect(connectString)
  .then((_) => console.log("Connected MongoDb successfully!"))
  .catch((err) => console.log("Error connection: " + err.message));

if (1 === 0) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
