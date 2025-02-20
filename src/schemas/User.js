const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcrypt');

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
    },
    loginToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

const User = model('User', userSchema);

module.exports = User;
