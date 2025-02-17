const mongoose = require("mongoose");
const { Schema, model } = mongoose; // Destructure Schema and model from mongoose

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    balance: {
      type: Schema.Types.Decimal128,
      default: 0.0,
      validate: {
        validator: function (value) {
          // Check if the value has up to 2 decimal places
          return /^\d+(\.\d{1,2})?$/.test(value.toString());
        },
        message: "Balance must have up to 2 decimal places.",
      },
    },
    lastDailyCollected: {
      type: Date,
    },
    cardCollection: [
      {
        type: Schema.Types.ObjectId,
        ref: "CardCollection",
      },
    ],
    password: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);


const User = model("User", userSchema);

module.exports = User;
