const { User, Card } = require("./../schemas/index");
const mongoose = require('mongoose');
const url = process.env.url || "http://localhost:3000";
module.exports = {
  getUser: async (interaction) => {
    // Fetch user by userId, which is a string
    let user = await User.findOne({
      userId: interaction.member.id, // Use userId (string) here
    });

    // If no user is found, create a new one along with a CardCollection
    if (!user) {
      user = new User({
        userId: interaction.member.id, // userId as a string
        username: interaction.user.username,
        avatar: interaction.user.displayAvatarURL({
          dynamic: true,
          size: 4096,
        }),
        password: Math.random().toString(36).slice(2, 10),
      });
      await user.save();
    }

    return { user };
  },
  addToCollection: async (pkmnData, user, marketValue) => {
    const { id, name, set, images, tcgplayer } = pkmnData;
    let pkmn = await Card.findOne({
      cardId: pkmnData.id,
    });
    if (!pkmn) {
      pkmn = new Card({
        cardId: id,
        name: name,
        price: marketValue,
        set: {
          id: set.id,
          name: set.name,
          series: set.series,
        },
        images: {
          small: images.small,
          large: images.large,
        },
        tcgPlayer: tcgplayer.url,
      });
    }
    if(parseFloat(pkmn.price) !== marketValue) {
      pkmn.price = marketValue
    }
    await pkmn.save();
    user.cardCollection.push(pkmn._id);
    await user.save();
  },
  getValue: (marketValue, value) => {
    const amount = parseFloat(marketValue);
    const newAmount = parseFloat(value) + amount;
    return newAmount.toFixed(2)
  },
  getCardValue: (prices) => {
    if (!prices || Object.keys(prices).length === 0) {
      return "No price data available";
    }
    const keys = Object.keys(prices);
    const lastKey = keys[keys.length - 1];
    const marketValue = prices[lastKey].market;
    return parseFloat(marketValue);
  },
  inGuild: async (interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "This command can only be executed inside a server",
        ephemeral: true,
      });
      return false;
    }
  },
  goToSite: (action, user) => {
    switch (action) {
      case "login":
        return `${url}/login`;
      case "collection":
        return `${url}/collection/${user.userId}`;
      default:
        return `${url}/`;
    }
  },
};
