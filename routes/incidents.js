const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const { Incident, validate } = require("../models/incident");
const { Category } = require("../models/incidentCategory");

router.get("/", [auth], (req, res) => {
  const incidents = await Incident.find();

  if (!incidents)
  return res.status(404).send("The incidents not found.");

  res.send(incidents);
});

router.get("/me", async (req, res) => {
  const incidents = Incident.owner.find({ _id: req.user._id });

  if (!incidents)
  return res.status(404).send("The incidents not found.");

  res.send(incidents);
});

router.get("/:id", [auth,validateObjectId], (req, res) => {
  const incident = await Incident.findById(req.params.id);

  if (!incident)
  return res.status(404).send("The incident with the given ID was not found.");

  res.send(incidents);
});


router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) res.status(404).send("Invalid Category");

  const { description, mobile } = req.body;

  const incident = new Incident({
    status: "unreviewed",
    category: {
      _id: category._id,
      name: category.name
    },
    description,
    mobile,
    dateCreated: Date.now(),
    owner: req.user
  });

  await incident.save();

  res.send(incident);
});

router.delete("/:id", [auth, validateObjectId], async (req, res) => {
  const incident = await Incident.findbyId(req.params.id);

  if (!incident)
    return res
      .status(404)
      .send("The incident with the given ID was not found.");

  if (incident.status === "unreviewed")
    return res.status(409).send("The deletion of the incident is not allowed");

  res.send(incident);
});
