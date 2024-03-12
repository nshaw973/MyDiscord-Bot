const {ApplicationCommandOptionType, PermissionFlagsBits }= require('discord.js')

module.exports = {
    name: 'ban',
    description: 'Bans a user from server',
    options: [
        {
            name: 'target-user',
            description: 'The user to ban.',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'The reason for ban.',
            required: false,
            type: ApplicationCommandOptionType.String,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],

    callback: (client, interaction) => {
        interaction.reply(`ban..`)
    }
}