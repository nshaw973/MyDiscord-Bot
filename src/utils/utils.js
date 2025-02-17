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
      });
  
      // Create a new CardCollection document
      const cardCollection = new CardCollection({
        userId: user._id,  // This references MongoDB's ObjectId (_id) of the User
        cardIds: [],
      });
  
      // Associate the CardCollection with the User
      user.cardCollection.push(cardCollection._id);
  
      // Save both the User and CardCollection
      await cardCollection.save();
      await user.save();
    }
  
    // Retrieve the cardCollection based on the user's _id
    const cardCollection = await CardCollection.findOne({
      userId: user._id,  // Use user._id for CardCollection reference
    });
  
    return { user, cardCollection };
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
    cardCollection.cardIds.push(pkmn._id)
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
