const { SlashCommandBuilder } = require("discord.js");
const { getUser, inGuild, goToSite } = require("../../utils/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view-collection")
    .setDescription("View your collection."),
  async execute(interaction) {
    if(!inGuild(interaction)) return;
    try {
      // Initialize
      await interaction.reply({
        content: "Retrieving your collection link...",
        ephemeral: true
      });
      // Get User, or create a new one.
      const { user, cardCollection } = await getUser(interaction)
      // Returns the users balance
      await interaction.editReply({
        content: `Hi ${interaction.member.displayName}! \n[View your Collection here!](${goToSite('collection', user)})`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(`Error handling /daily: ${error}`);
    }
  },
};
