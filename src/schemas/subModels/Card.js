const mongoose = require("mongoose");
const { Schema, model } = mongoose

const cardSchema = new Schema({
  cardId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  set: {
    id: String,
    name: String,
    series: String,
  },
  images: {
    small: String,
    large: String,
  },
  tcgPlayer: {
    type: String,
  },
});

const Card = model('Card', cardSchema);

module.exports = Card;