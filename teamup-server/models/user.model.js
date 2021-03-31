const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an Email!"],
      unique: [true, "Email already exist"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password!"],
      unique: false,
    },
    fullname: {
      type: String,
    },
    resetCode: {
      type: Number,
    },
    role: {
      type: Number,
      default: 2,
    },
    token: {
      type: String,
      default: null,
    },
    profilePic: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model.User || mongoose.model("User", UserSchema);
