const mongoose = require("mongoose");
const { categorySchema } = require("../models/incidentCategory");
const { regularUserSchema } = require("../models/regularUser");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const incidentSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ["unreviewed", "reviewed", "resolved"],
    require: true
  },
  category: {
    type: categorySchema,
    require: true
  },
  description: {
    type: String,
    minlength: 5,
    maxlength: 255,
    require: function() {
      return this.category.name === "სხვა";
    }
  },
  mobile: {
    type: String,
    require: true,
    validate: {
      validator: function(v) {
        if (
          v.match(
            /^(514|544|550|551|555|557|558|559|568|570|571|574|577|579|591|592|593|595|596|597|598|599){1}[0-9]{6}$/
          )
        )
          return true;
        return false;
      },
      message: "invalid mobile number"
    }
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  },
  dateResolved: Date,
  owner: {
    type: regularUserSchema,
    require: true
  },
  user: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
      validate: {
        validator: function(v) {
          if (v.match(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi)) return true;
          return false;
        },
        message: "invalid email"
      }
    }
  }
});

const Incident = mongoose.model("incident", incidentSchema);

function validate(incident) {
  const schema = {
    categoryId: Joi.objectId().required(),
    description: Joi.string()
      .min(5)
      .max(255),
    mobile: Joi.string()
      .regex(
        /^(514|544|550|551|555|557|558|559|568|570|571|574|577|579|591|592|593|595|596|597|598|599){1}[0-9]{6}$/
      )
      .required()
      .error(error => {
        return { message: "invalid mobile number" };
      })
  };

  return Joi.validate(incident, schema);
}

module.exports.Incident = Incident;
module.exports.validate = validate;
