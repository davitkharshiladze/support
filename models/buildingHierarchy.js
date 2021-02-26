const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// const regionSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   }
// });

const buildingHierarchySchema = new mongoose.Schema({
  region: {
    type: String,
    required: true
  },
  buildings: {
    type: [buildingSchema],
    validate: {
      validator: v => v.length >= 1,
      message: "You must provide more than 1 item"
    }
  }
});

const BuildingHierarchy = mongoose.model(
  "buildingHierarchy",
  buildingHierarchySchema
);

module.exports.BuildingHierarchy = BuildingHierarchy;
module.exports.buildingSchema = buildingSchema;
