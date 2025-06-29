const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const formate = require("../lib/emailFormate");
const TempUser = require("../models/temUserData");
const User = require("../models/User");
// const hashPassword = require("../lib/bcrypt_jwt.");
const emailJwtSign = require("../lib/bcrypt_jwt.");
const isSignin = require("../lib/isSignin");
const isPassword = require("../lib/isPassword");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const protectedRoute = require("../middleware/protectedRoute");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

router.post("/otp", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(400).json({ message: "User already signed up." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const mailOptions = formate(email, otp);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    // Hash the password using async/await
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    let data = await TempUser.findOne({ name: username });
    let savedUser;

    if (!data) {
      const tempUser = new TempUser({
        name: username,
        email,
        password: hashedPassword,
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000,
      });
      savedUser = await tempUser.save();
    } else {
      data.set({
        name: username,
        email,
        password: hashedPassword,
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000,
      });
      savedUser = await data.save();
    }

    return res.status(200).json({
      message: "OTP sent successfully!",
      id: savedUser._id,
    });
  } catch (error) {
    console.error("Error in /otp route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { otp, id } = req.body;
    const userData = await TempUser.findById(id);
    if (!userData) {
      console.log("1");
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date();
    const { name, email, password } = userData;
    if (userData.otp === otp && userData.otpExpires > now) {
      await new User({ name, email, password }).save();
      res.cookie("token", emailJwtSign(email), {
        signed: true,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      await userData.deleteOne();
      return res
        .status(200)
        .json({ message: "OTP verified and user created", email });
    } else {
      return res.status(400).json({ message: "OTP is not valid or expired" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signin", isSignin, async (req, res) => {
  const { email, password } = req.body.payload;
  try {
    const man = await User.findOne({ email });
    if (!man) {
      return res.status(400).json({ message: "Invalid email" });
    }

    let hashPass = man.password;

    const isMatch = await isPassword(password, hashPass);
    console.log(isMatch);
    if (isMatch) {
      res.cookie("token", emailJwtSign(email), {
        signed: true,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      return res.status(200).json({ message: "Login successful", email });
    } else {
      return res.status(400).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.error("Unexpected error during login:", error);
    return res.status(500).json({ message: "Unexpected Server Error" });
  }
});

router.post("/clerk-auth", async (req, res) => {
  try {
    const { clerkId, name, email } = req.body.payload;
    console.log(clerkId, name, email);
    if (!clerkId || !name || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let user = await User.findOne({ email });

    if (user) {
      user.clerkId = clerkId;
      user.name = name;
      await user.save();
      res.cookie("token", emailJwtSign(email), {
        signed: true,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      console.log(email);
      return res.status(200).json({ message: "User updated", email });
    } else {
      const newUser = await new User({ clerkId, name, email }).save();
      res.cookie("token", emailJwtSign(email), {
        signed: true,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      console.log(email);
      return res.status(201).json({ message: "User created", email });
    }
  } catch (err) {
    console.error("Error in /clerk-auth:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/signOut", protectedRoute, (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error during logout:", err.message);
    return res
      .status(500)
      .json({ message: "Logout failed. Please try again." });
  }
});

router.get("/checkLogin", protectedRoute, (req, res, next) => {
  console.log("hi=>", req.user);
  res.status(200).send({ message: "user is authenticate", user: req.user });
});

module.exports = router;
