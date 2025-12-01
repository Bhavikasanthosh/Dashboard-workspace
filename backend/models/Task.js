// backend/models/Task.js
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String, // store as "2025-11-30"
    default: null,
  },
  priority: {
    type: String,
    default: "Medium", // "High" | "Medium" | "Low"
  },
});

module.exports = mongoose.model("Task", TaskSchema);
