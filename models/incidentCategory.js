const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Category = mongoose.model("Category", categorySchema);

function validateCategory(incidentCategory) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
  };

  return Joi.validate(Category, schema);
}

module.exports.categorySchema = categorySchema;
module.exports.Category = Category;
module.exports.validate = validateCategory;
