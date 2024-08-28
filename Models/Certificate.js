const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  elements: { type: Array, required: true },
  background: { type: String },
});

module.exports = mongoose.model("Certificate", certificateSchema);
