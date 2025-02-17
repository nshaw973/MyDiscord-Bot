const { SlashCommandBuilder, ChannelType } = require("discord.js");
const fetchPkmn = require("../../utils/API/pkmnTCG"); // Import the module
const pkmnSets = require("../../utils/lists/pkmnSets");
const { getUser, addToCollection } = require("../../utils/utils");

const getValue = (prices) => {
  if (!prices || Object.keys(prices).length === 0) {
    return "No price data available";
  }
  const keys = Object.keys(prices);
  const lastKey = keys[keys.length - 1];
  const marketValue = prices[lastKey].market;
  return `$${marketValue}`;
};

const ALLOWED_CHANNEL = "pkmn-cards";
const cost = 3.0;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("open-pack")
    .setDescription(`Let's the user open a pack for ${cost}`)
    .addStringOption((option) =>
      option
        .setName("set")
        .setDescription("The set name")
        .setRequired(true)
        .addChoices(...pkmnSets)
    ), // Ensure the option is returned
  async execute(interaction) {
    // Can only be used in the pkmnData-cards channel
    let allowedChannel = interaction.guild.channels.cache.find(
      (channel) => channel.name === ALLOWED_CHANNEL
    );

    // If the channel doesn't exist, create it
    if (!allowedChannel) {
      try {
        allowedChannel = await interaction.guild.channels.create({
          name: ALLOWED_CHANNEL,
          type: ChannelType.GuildText,
          reason: "Channel for bot commands",
        });
        return interaction.reply({
          content: `${allowedChannel} has been created.`,
          ephemeral: true,
        });
      } catch (error) {
        console.error("Error creating channel:", error);
        return interaction.reply({
          content:
            "An error occurred while creating the channel. Please contact an administrator.",
          ephemeral: true,
        });
      }
    }
    //Checks to see if it's being executed in the correct channel
    if (interaction.channelId !== allowedChannel.id) {
      return interaction.reply({
        content: `This command can only be used in ${allowedChannel}.`, // Mention the allowed channel
        ephemeral: true,
      });
    }
    // Get the user
    const { user }  = await getUser(interaction)
    if (user.balance < cost) {
      interaction.reply({
        content:
          "Not enough money to open a pack! Grab your daily, or wait till tomorrow!",
      });
      return;
    }

    const pkmnSet = interaction.options.getString("set");

    // Validate the set input
    if (!pkmnSet || pkmnSet.trim() === "") {
      await interaction.reply("Please provide a valid set name.");
      return;
    }

    try {
      user.balance -= cost;
      const deductedAmount = parseFloat(user.balance);
      await interaction.reply(
        `Opening your pack! Balance: $${deductedAmount.toFixed(2)}`
      );

      // Call the getSet function and wait for the result
      const pkmnData = await fetchPkmn.getSet(pkmnSet);
      const { name, images, rarity, tcgplayer, set } = pkmnData;
      await addToCollection(pkmnData, user)

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
      const removeSign = marketValue.replace("$", "");
      const amount = parseFloat(removeSign);
      const newAmount = parseFloat(user.balance) + amount;
      user.balance = newAmount.toFixed(2);
      await user.save();
      await interaction.followUp({
        content: `Balance updated: $${user.balance}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error fetching Pokémon set:", error);
      await interaction.editReply(
        "Unable to fetch a pack. Please try again later."
      );
    }
  },
};
