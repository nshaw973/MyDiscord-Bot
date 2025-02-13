const { SlashCommandBuilder } = require("discord.js");
const fetchPkmn = require("../../utils/API/pkmnTCG"); // Import the module
const pkmnSets = require("../../utils/lists/pkmnSets");

const getValue = (prices) => {
  if (!prices || Object.keys(prices).length === 0) {
    return "No price data available";
  }
  const keys = Object.keys(prices);
  const lastKey = keys[keys.length - 1];
  const marketValue = prices[lastKey].market;
  return `$${marketValue}`;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("open-pack")
    .setDescription("Let's the user open a pack")
    .addStringOption((option) =>
      option
        .setName("set")
        .setDescription("The set name")
        .setRequired(true)
        .addChoices(...pkmnSets)
    ), // Ensure the option is returned
  async execute(interaction) {
    await interaction.deferReply(); // Defer the reply while fetching data

    const pkmnSet = interaction.options.getString("set");

    // Validate the set input
    if (!pkmnSet || pkmnSet.trim() === "") {
      await interaction.editReply("Please provide a valid set name.");
      return;
    }

    try {
      // Call the getSet function and wait for the result
      const pkmn = await fetchPkmn.getSet(pkmnSet);
      console.log(pkmn);
      const { name, images, rarity, subtype, tcgplayer, set } = pkmn;
      const marketValue = getValue(tcgplayer.prices);
      const embed = {
        title: `Congrats you pulled a ${name}`,
        image: {
          url: images.large,
        },
        fields: [
          { name: "Name:", value: name, inline: true },
          { name: "Rarity:", value: rarity, inline: true },
          { name: "Market:", value: marketValue, inline: true },
          {
            name: "More Info",
            value: `[View on TcgPlayer](${tcgplayer.url})`,
            inline: false,
          },
        ],
        color: 0xffd700, // Gold color
        footer: {
          text: "Pokémon TCG",
          icon_url: set.images.logo, // Add an icon if you have one
        },
        timestamp: new Date().toISOString(),
      };
      // Send the result back to the user
      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error fetching Pokémon set:", error);
      await interaction.editReply(
        "Unable to fetch a pack. Please try again later."
      );
    }
  },
};
