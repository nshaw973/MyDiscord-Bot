const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cardCollectionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // Use ObjectId to reference the User model
    ref: 'User',
    required: true,
  },
  cardIds: [{
    type: Schema.Types.ObjectId, // Use ObjectId to reference the Card model
    ref: 'Card',
  }],
});

const CardCollection = model('CardCollection', cardCollectionSchema);

module.exports = CardCollection;
