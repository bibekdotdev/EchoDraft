const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const blockRoutes = require("./routes/blockRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const Admin = require("./routes/adminRoutes");
const port = process.env.PORT || 8080
require("dotenv").config();
dotenv.config();
mongoose
  .connect(
    "mongodb+srv://bibekjana68:Phv$sh4ZVhqRLU$@cluster0.bblbfgc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
  });

const app = express();

// Cloudinary config
cloudinary.config({
  cloud_name:process.env.cloud_name,
  api_key:process.env.api_key,
  api_secret:process.env.api_secret,
});

app.use(
  cors({
    origin: "https://echodraft.onrender.com",
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
