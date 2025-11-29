const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
const testRoutes = require("./routes/test");
app.use("/api/test", testRoutes);

// Auth route
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

// Start server
const PORT = 9000;  // required port
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
