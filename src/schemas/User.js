const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    balance: {
      type: Number,
      default: 0,
    },
    lastDailyCollected: {
      type: Date,
    },
    cardCollection: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
