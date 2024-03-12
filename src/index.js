require("dotenv").config();

const { Client, IntentsBitField } = require("discord.js");
const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
    console.log(`${c.user.username} is online.`);
  });

//Starts the bot
client.login(TOKEN);