require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const requestLogger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const articleRoutes = require("./routes/article.route");

const app = express();

// Connect to MongoDB (Atlas)
connectDB();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Blog API", version: "1.0.0" });
});

// Article routes
app.use("/api/articles", articleRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Central error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
