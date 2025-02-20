const { SlashCommandBuilder } = require("discord.js");
const { getUser, inGuild, goToSite } = require("../../utils/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view-credentials")
    .setDescription("View your username and password for the tcg site!"),
  async execute(interaction) {
    if (!inGuild(interaction)) return
    try {
      //Initialize
      await interaction.reply({
        content: "Retrieving your credentials...",
        ephemeral: true,
      });
      // Gets User, or creates one
      const { user, cardCollection } = await getUser(interaction)
      // Returns results
      await interaction.editReply({
        content: `Hi ${interaction.member.displayName}! \nDiscord ID: ${user.userId} \nPassword: ${user.loginToken} \n[Go To Login](${goToSite("login", user)})`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(`Error handling /daily: ${error}`);s
    }
  },
};
