const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

// Create a new User
router.post("/register", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (err) {
    res.status(400).send({
      error: "Unable to login (Invalid Username or Password)",
    });
  }
});

// Logout (Terminate current Session)
router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

// Logout from all sessions
router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

// Get current User
router.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

// Change Password
router.patch("/changePass", auth, async (req, res) => {
  if (!req.body["password"]) return res.status(400).send({ error: "Please provide a new password!!" });

  try {
    // Change the password
    req.user["password"] = req.body["password"];

    // Remove all tokens (sessions) except the current one
    const req_token = req.header("Authorization").replace("Bearer ", "");
    req.user.tokens = req.user.tokens.filter(token => token.token === req_token);

    await req.user.save();
    res.status(200).send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete a User
router.delete("/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
