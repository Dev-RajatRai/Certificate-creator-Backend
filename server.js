const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const certificateRoutes = require("./Routes/certificateRoutes");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(
  cors({
    origin: ["https://yourtrusteddomain.com"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", apiLimiter);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// MongoDB connection using environment variable for security
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Use certificate routes
app.use("/api", certificateRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
