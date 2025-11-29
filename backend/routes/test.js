const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "GET request from backend working!" });
});

module.exports = router;
