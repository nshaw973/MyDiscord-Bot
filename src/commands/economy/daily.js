const { SlashCommandBuilder } = require("discord.js");
const { getUser, inGuild } = require("../../utils/utils");
const dailyAmount = 5.0;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get-daily")
    .setDescription("Get your daily points!"),
  async execute(interaction) {
    if (!inGuild(interaction)) return;
    try {
      await interaction.deferReply();
      // Gets the user, or creates one.
      const { user, cardCollection } = await getUser(interaction)
      // Checks to see if the user has received a daily yet
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
      }
      // Updates the users balance
      const newAmount = parseFloat(user.balance) + dailyAmount;
      user.balance = newAmount.toFixed(2);
      user.lastDailyCollected = new Date();
      // Save the balance for the user
      await user.save();
      // Shows the user their new balance
      await interaction.editReply({
        content: `$${dailyAmount} has been added to your balance. \nNew balance: $${user.balance}`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(`Error handling /daily: ${error}`);
    }
  },
};
