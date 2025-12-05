const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());


mongoose
  .connect("mongodb://127.0.0.1:27017/workspace_dashboard")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection failed:", err));

// routes

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);


const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);


const noteRoutes = require("./routes/noteRoutes");
app.use("/api/notes", noteRoutes);


app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});