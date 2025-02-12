const { SlashCommandBuilder } = require("discord.js");

module.exports = {
//Creates the Greet Command
  data: new SlashCommandBuilder()
    // Must be lowercase
    .setName("bye")
    .setDescription("Say goodbye to the server user"),
    async execute(interaction) {
        await interaction.reply(`Goodbye ${interaction.user.username}!`)
    }
};
