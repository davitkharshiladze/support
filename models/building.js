const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region"
  }
});

const Building = mongoose.model("building", buildingSchema);

module.exports.Building = Building;
