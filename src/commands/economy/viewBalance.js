const { SlashCommandBuilder } = require("discord.js");
const { User } = require("../../schemas/index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view-balance")
    .setDescription("View your current balance."),
  async execute(interaction) {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "This command can only be executed inside a server",
        ephemeral: true,
      });
      return;
    }
    try {
      await interaction.reply({
        content: "Retrieving your balance...",
        ephemeral: true
      });
      let user = await User.findOne({
        userId: interaction.member.id,
      });
      if (!user) {
        user = new User({
          userId: interaction.member.id,
        });
      }
      await interaction.editReply({
        content: `Hi ${interaction.member.displayName}! \nYour current balance is: ${user.balance}`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(`Error handling /daily: ${error}`);
    }
  },
};
