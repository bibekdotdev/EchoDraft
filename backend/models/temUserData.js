const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpires: {
    type: Date,
  },
});

const TempUser = mongoose.model("TempUser", tempUserSchema);

module.exports = TempUser;
