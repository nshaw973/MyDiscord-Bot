const mongoose = require('mongoose');
const { Schema, model } = mongoose;

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
    avatar: {
      type: String
    },
    balance: {
      type: Schema.Types.Decimal128,
      default: 5.0
    },
    lastDailyCollected: {
      type: Date,
    },
    cardCollection: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Card',
      },
    ],
    collectionWorth: {
      type: Schema.Types.Decimal128,
      default: 0.0
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const User = model('User', userSchema);

module.exports = User;
