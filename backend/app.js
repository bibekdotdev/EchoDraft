const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const blockRoutes = require("./routes/blockRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const Admin = require("./routes/adminRoutes");
require("dotenv").config();
const port = process.env.PORT || 4000 



dotenv.config();
mongoose
  .connect(process.env.mongoose_link)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
  });

const app = express();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

app.use(
  cors({
    origin: "https://echo-draft-67wv.onrender.com/",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser("shhhhh"));

// Routes
app.use("/api/blocks", blockRoutes);
app.use("/api/Auth", authRoutes);
app.use("/api/admin", Admin);

// Start Serve
app.listen(port, () => console.log(`Server running on port ${port}`));
