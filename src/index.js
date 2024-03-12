require("dotenv").config();

const { Client, IntentsBitField } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

eventHandler(client);

//Starts the bot
client.login(TOKEN);