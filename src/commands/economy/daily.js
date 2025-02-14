const { SlashCommandBuilder } = require("discord.js");
const { User } = require("../../schemas/index");
const dailyAmount = 5.00;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get-daily")
    .setDescription("Get your daily points!"),
  async execute(interaction) {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "This command can only be executed inside a server",
        ephemeral: true,
      });
      return;
    }
    try {
      await interaction.deferReply();
      let user = await User.findOne({
        userId: interaction.member.id,
      });
      if (user) {
        const lastDailyDate = user.lastDailyCollected?.toDateString();
        const currentDate = new Date().toDateString();
        if (lastDailyDate === currentDate) {
          interaction.editReply({
            content:
              "You have already collected your daily today. Come back tomorrow.",
            ephemeral: true,
          });
          return;
        }
      } else {
        user = new User({
          userId: interaction.member.id,
        });
      }
      user.balance += dailyAmount;
      user.lastDailyCollected = new Date();
      await user.save();
      await interaction.editReply({
        content: `${dailyAmount} has been added to your balance. \nNew balance: ${user.balance}`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(`Error handling /daily: ${error}`);
    }
  },
};
