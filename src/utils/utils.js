const { User, CardCollection, Card } = require("./../schemas/index");
const url = process.env.url || "http://localhost:3000";
module.exports = {
  getUser: async (interaction) => {
    // Fetch user by userId, which is a string
    let user = await User.findOne({
      userId: interaction.member.id,  // Use userId (string) here
    });
  
    // If no user is found, create a new one along with a CardCollection
    if (!user) {
      user = new User({
        userId: interaction.member.id, // userId as a string
        username: interaction.user.username,
        password: Math.random().toString(36).slice(2, 10),
        balance: 5.0,
        cardCollection: []
      });
      await user.save();
    }
  
    return { user };
  },
  addToCollection: async (pkmnData, user) => {
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
    user.cardCollection.push(pkmn._id)
    await user.save();
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
