require("dotenv").config();
const fs = require('fs')
const path = require('path')

const {
  Client,
  Events,
  GatewayIntentBits,
  Collection
} = require("discord.js");
const TOKEN = process.env.Token;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

const folderspath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(folderspath)

for(const folder of commandFolders) {
  const commandsPath = path.join(folderspath, folder)
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
  for(const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath) 

    if('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command) 
    } else {
      console.log(`The command at ${filePath} is missing "data" and/or "execute" properties`)
    }
  }
}

client.on(Events.InteractionCreate, async interaction => {
  if(!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if(!command) {
    console.error(`No command matching ${interaction.commandName} was found. `)
    return
  }
   try {
    await command.execute(interaction)
   } catch (error) {
    console.error(error)
    if(interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true})
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true})
    }
   }


})

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready: Logged in and ${readyClient.user.tag} is ready`)
})

//Starts the bot
client.login(TOKEN);
