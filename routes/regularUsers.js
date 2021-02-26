const { User, validate } = require("../models/regularUser");
const { Incident } = require("../models/incident");
const auth = require("../middleware/auth");
const registration = require("../middleware/registration");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const axios = require("axios");

// router.get("/incidents", async (req, res) => {
//   const incidents = Incident.owner.find({ _id: req.user._id });
// });

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { data } = await axios.get(
    "https://eflow.mia.ge/restapi/session/getSessionData",
    {
      headers: {
        Cookie: req.header("sessionExpression")
      }
    }
  );

  const user = new User(
    _.pick(data.passport.employee, [
      "firstName",
      "lastName",
      "personalNo",
      "positionName",
      "orgStructureName"
    ])
  );
  user.userName = data.passport.userName.toLowerCase();
  user.building = req.body.buildingId;
  user.mobile = req.body.mobile;

  if (await User.findOne({ personalNo: user.personalNo }))
    return res.status(400).send("User already registered.");

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(
      _.pick(user, [
        "userName",
        "firstName",
        "lastName",
        "personalNo",
        "positionName",
        "orgStructureName",
        "building",
        "mobile"
      ])
    );
});

module.exports = router;
