const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get-daily")
    .setDescription("Get your daily points!"),
  async execute(interaction) {
    interaction.reply({
        content: `Here are your daily points!`,
        ephemeral: true,
      });
  },
};
