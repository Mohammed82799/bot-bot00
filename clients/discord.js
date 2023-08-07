let { Client, GatewayIntentBits, PermissionsBitField} = require('discord.js')

let client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildBans
  ]
})



client.login("MTA0MDY4NDAzODUwMDkwOTE0Ng.GQtkH9.8oTs7GRsXRWCXGcz3J5u2bnL73532qc7WlBYcM")

client.on('ready', async () => {
console.log(`${client.user.tag}'s Invite Link : (https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=268435456&scope=bot)`)
})
module.exports = client