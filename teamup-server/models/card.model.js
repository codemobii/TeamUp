const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    status: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model.Todo || mongoose.model("Todo", TodoSchema);
