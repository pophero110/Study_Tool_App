const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Point = mongoose.model("Point", pointSchema);
module.exports = Point;
