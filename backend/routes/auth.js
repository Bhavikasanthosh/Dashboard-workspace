const express = require("express");
const User = require("../models/User"); // Import the model
const router = express.Router();

// SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Create new user in MongoDB
    // (Note: In a real app, you should hash the password here using bcrypt)
    const newUser = await User.create({ email, password });

    res.status(201).json({
      message: "Signup successful",
      user: { id: newUser._id, email: newUser.email }
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Error creating user" });
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user in MongoDB
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Return success (and a fake token for now)
    res.json({
      message: "Login successful",
      token: "fake-jwt-token-" + user._id,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;