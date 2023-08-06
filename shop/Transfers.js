module.exports = client => {
const {PermissionsBitField, AuditLogEvent, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
const fs = require('fs');  
const settingsBuffer = fs.readFileSync('DataBases/ShopSettings.json');
const settings = JSON.parse(settingsBuffer)
const Profix = settings.ShopSettings.Profix 
const { Database } = require('st.db')
client.on('messageCreate', (message) => {
if (message.author.bot) return
if (message.content === `${Profix}التحويلات`) {
if(!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return   
const author = message.guild.members.cache.get(message.author.id);
const RoleColor = [];    
const highestRoleWithColor = author.roles.cache.filter(role => role.color && role.color !== 0).sort((a, b) => b.position - a.position).first();
if (highestRoleWithColor) {
const colorHex = highestRoleWithColor.color.toString(16).padStart(6, '0');
RoleColor.push(`#${colorHex}`)
} else {
RoleColor.push(`#F2F3F5`)
} 
let embed = new EmbedBuilder()
.setDescription(`**اضغط على الزر**`)
.setColor(`${RoleColor}`)
.setTitle(`اعدادات التحويل`)
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
const Transfers = new ActionRowBuilder()
.setComponents(
new ButtonBuilder()
.setCustomId('Transfers')
.setStyle(ButtonStyle.Success)
.setEmoji('➕')
)
message.channel.send({content:`**هيا أفعلها**`,embeds: [embed], components: [Transfers] })
}
})
client.on('interactionCreate', async (interaction) => {
if (interaction.isButton()) {
if (interaction.customId === 'Transfers') {
const modal = new ModalBuilder()
.setTitle('Transfers')
.setCustomId('Transfers')
const q1 = new TextInputBuilder()
.setCustomId('q1')
.setLabel(`التحويل إلى`)
.setMinLength(2)
.setMaxLength(25)
.setRequired(true)
.setStyle(TextInputStyle.Short)
const q2 = new TextInputBuilder()
.setCustomId('q2')
.setLabel(`بوت التحويلات`)
.setMinLength(2)
.setMaxLength(25)
.setStyle(TextInputStyle.Short)
.setRequired(true)
const q3 = new TextInputBuilder()
.setCustomId('q3')
.setLabel(`شات ارسال التحويلات`)
.setMinLength(1)
.setMaxLength(25)
.setStyle(TextInputStyle.Short)
.setRequired(true)
const rows = [q1,q2,q3].map(
(component) => new ActionRowBuilder().addComponents(component)
)
modal.addComponents(...rows);
interaction.showModal(modal);
}
}
if (interaction.customId === 'Transfers') {
const server = client.guilds.cache.get(interaction.message.guildId);
const channel = server.channels.cache.get(interaction.message.channelId);
const fetchedMessage = await channel.messages.fetch(interaction.message.id);
const q1 = interaction.fields.getTextInputValue('q1') || `لم يجاوب/تجاوب`;
const q2 = interaction.fields.getTextInputValue('q2') || `لم يجاوب/تجاوب`;
const q3 = interaction.fields.getTextInputValue('q3') || `لم يجاوب/تجاوب`;
const TransfersNew = new Database(`DataBases/ShopSettings.json`) 
 TransfersNew.set(`Transfers`, {
    TransfersFOR: q1,
    Bot: q2,
   Channel: q3
  })
const author = interaction.guild.members.cache.get(interaction.member.id);
const RoleColor = [];    
const highestRoleWithColor = author.roles.cache.filter(role => role.color && role.color !== 0).sort((a, b) => b.position - a.position).first();
if (highestRoleWithColor) {
const colorHex = highestRoleWithColor.color.toString(16).padStart(6, '0');
RoleColor.push(`#${colorHex}`)
} else {
RoleColor.push(`#F2F3F5`)
} 
let embed = new EmbedBuilder()
.setDescription(`**التحويلات إلى : <@!${q1}>\nالبوت : <@!${q2}>\nشات التحويلات : <#${q3}>**`)
.setColor(`${RoleColor}`)
.setTitle(`تم الضبط بنجاح`)
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
const Transfers = new ActionRowBuilder()
.setComponents(
new ButtonBuilder()
.setCustomId('Transfers')
.setStyle(ButtonStyle.Danger)
.setDisabled(true)
.setEmoji('➕')
)
fetchedMessage.edit({content:`**تمت بنجاح!**`,embeds: [embed], components: [Transfers] })
interaction.reply({ content: `**تم الإضافة**`, ephemeral: true})
}
})
}