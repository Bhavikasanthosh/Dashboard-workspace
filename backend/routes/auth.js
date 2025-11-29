const express = require("express");
const router = express.Router();

let users = []; // temporary memory storage — OK for student project

router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ email, password });

  res.json({
    message: "Signup successful",
    token: "fake-jwt-token-" + Date.now()
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    token: "fake-jwt-token-" + Date.now()
  });
});

module.exports = router;
