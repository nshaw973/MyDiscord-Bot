const mongoose = require("mongoose");
const { Schema, model } = mongoose

const cardCollectionSchema = new Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  cardIds: [{
    type: String,
    ref: 'Card',
  }],
});

const CardCollection = model('CardCollection', cardCollectionSchema);

module.exports = CardCollection;