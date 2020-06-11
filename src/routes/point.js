const express = require("express");
const router = express.Router();
const Point = require("../db/models/Point");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

router.get("/points", auth, async (req, res) => {
  try {
    await req.user.populate("points").execPopulate();

    res.status(200).send({ points: req.user.points });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/points/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new Error("Invalid Id");
    }
    const point = await Point.findOne({ _id, owner: req.user._id });
    if (!point) {
      return res.status(404).send({ error: "Point is not found" });
    }
    res.status(200).send({ point });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/points", auth, async (req, res) => {
  try {
    const point = new Point({
      ...req.body,
      owner: req.user._id,
    });
    await point.save();
    res.send({ point: point });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete("/points/:id", auth, async (req, res) => {
  try {
    const point = await Point.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!point) {
      res.status(404).send({ error: "Point is not found" });
    }

    res.send({ point });
  } catch (error) {
    res.status(400).send();
  }
});
router.patch("/points/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowdUpdated = ["description", "title"];
  const isValidUpdate = updates.every((update) =>
    allowdUpdated.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid point update" });
  }
  try {
    const point = await Point.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!point) {
      return res.status(404).send({ error: "Point is not found" });
    }
    updates.forEach((update) => (point[update] = req.body[update]));
    await point.save();

    res.send({ point });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
