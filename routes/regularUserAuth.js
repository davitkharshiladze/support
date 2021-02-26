const { RegularUser } = require("../models/regularUser");
const Joi = require("@hapi/joi");
const querystring = require("querystring");
const config = require("config");
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send("Invalid username or password.");

  const { username, password } = req.body;

  const userCredentials = querystring.stringify({
    username,
    password
  });

  const { data, headers } = await axios.post(
    "https://eflow.mia.ge/restapi/security/signIn",
    userCredentials,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  if (data !== "SUCCESSFUL")
    return res.status(400).send("username or password is incorrect");

  const sessionExpression = headers["set-cookie"][0].split(";")[0];
  const { data: userData } = await axios.get(
    "https://eflow.mia.ge/restapi/session/getSessionData",
    {
      headers: {
        Cookie: sessionExpression
      }
    }
  );

  const {
    positionName,
    orgStructureName,
    personalNo
  } = userData.passport.employee;

  const user = await RegularUser.findOne({ userName: username, personalNo });
  if (!user)
    return res
      .header("sessionExpression", sessionExpression)
      .header("access-control-expose-headers", "sessionExpression")
      .send({ user: username });

  if (user.positionName !== positionName) {
    user.positionName = positionName;
  }

  if (user.orgStructureName !== orgStructureName) {
    user.orgStructureName = orgStructureName;
  }

  await user.save();

  res.send(user.generateAuthToken());
});

function validate(req) {
  const schema = {
    username: Joi.string()
      .min(5)
      .max(255)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
