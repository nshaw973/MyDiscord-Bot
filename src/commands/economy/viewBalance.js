const { SlashCommandBuilder } = require("discord.js");
const { getUser, inGuild } = require("../../utils/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view-balance")
    .setDescription("View your current balance."),
  async execute(interaction) {
    if(!inGuild(interaction)) return;
    try {
      // Initialize
      await interaction.reply({
        content: "Retrieving your balance...",
        ephemeral: true
      });
      // Get User, or create a new one.
      const { user, cardCollection } = await getUser(interaction)
      // Returns the users balance
      await interaction.editReply({
        content: `Hi ${interaction.member.displayName}! \nYour current balance is: $${user.balance}`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(`Error handling /daily: ${error}`);
    }
  },
};
