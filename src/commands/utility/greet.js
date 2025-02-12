const { SlashCommandBuilder } = require("discord.js");

module.exports = {
//Creates the Greet Command
  data: new SlashCommandBuilder()
    // Must be lowercase
    .setName("greet")
    .setDescription("Greet the server user"),
    async execute(interaction) {
        await interaction.reply(`Hello ${interaction.user.username}!`)
    }
};
