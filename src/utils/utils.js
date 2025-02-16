const { User, CardCollection, Card } = require("./../schemas/index");
const url = process.env.url || "http://localhost:3000";
module.exports = {
  getUser: async (interaction) => {
    let user = await User.findOne({
      userId: interaction.member.id,
    });
    let cardCollection = await CardCollection.findOne({
      userId: interaction.member.id
    })
    if (!user) {
      cardCollection = new CardCollection({
        userId: interaction.member.id,
        cardIds: []
      });
      user = new User({
        userId: interaction.member.id,
        username: interaction.user.username,
        password: Math.random().toString(36).slice(2, 10),
        balance: 5.0,
        cardCollection: cardCollection
      });

    }
    return {user, cardCollection};
  },
  addToCollection: async (pkmnData, cardCollection) => {
    const { id, name, set, images, tcgplayer } = pkmnData;
    let pkmn = await Card.findOne({
      cardId: pkmnData.id,
    });
    if (!pkmn) {
      pkmn = new Card({
        cardId: id,
        name: name,
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
    await pkmn.save()
    cardCollection.cardIds.push(pkmn.cardId)
    await cardCollection.save();
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
