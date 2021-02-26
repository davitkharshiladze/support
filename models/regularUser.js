const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const regularUserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  personalNo: {
    type: String,
    required: true,
    unique: true,
    minlength: 11,
    maxlength: 11
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  positionName: {
    type: String,
    required: true
  },
  orgStructureName: {
    type: String,
    required: true
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Building",
    required: true
  },
  mobile: {
    type: String,
    required: true,
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
  role: {
    type: String,
    default: "regularUser"
  }
});

regularUserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      userName: this.userName,
      firstName: this.firstName,
      lastName: this.lastName,
      personalNo: this.personalNo,
      positionName: this.positionName,
      orgStructureName: this.orgStructureName,
      building: this.building,
      mobile: this.mobileNumber,
      role: this.role
    },
    config.get("jwtPrivateKey")
  );

  return token;
};

regularUserSchema.methods.fullName = function() {
  return this.firstName + " " + this.lastName;
};

const RegularUser = mongoose.model("RegularUser", regularUserSchema);

function validate(user) {
  const schema = {
    buildingId: Joi.objectId().required(),
    mobile: Joi.string()
      .required()
      .regex(
        /^(514|544|550|551|555|557|558|559|568|570|571|574|577|579|591|592|593|595|596|597|598|599){1}[0-9]{6}$/
      )
      .error(error => {
        return { message: "invalid mobile number" };
      })
  };

  return Joi.validate(user, schema);
}

module.exports.RegularUser = RegularUser;
module.exports.regularUserSchema = regularUserSchema;
module.exports.validate = validate;
