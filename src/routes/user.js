const express = require("express");
const router = express.Router();
const User = require("../db/models/User");
const auth = require("../middleware/auth");

//signup
router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
//login
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((element) => {
      return element.token !== req.token;
    });
    await req.user.save();

    res.send({ user: req.user });
  } catch (error) {
    res.status(500).send();
  }
});

//logoutAll
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send({ user: req.user });
  } catch (error) {
    res.status(500).send();
  }
});

//read user profile
router.get("/users/me", auth, (req, res) => {
  res.send({ user: req.user });
});

//delete user account
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send({ user: req.user });
  } catch (error) {
    res.status(500).send();
  }
});

//update user profile
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowdUpdated = ["name", "password"];
  const isValidUpdate = updates.every((update) =>
    allowdUpdated.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid user updates" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));

    await req.user.save();

    res.send({ user: req.user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
