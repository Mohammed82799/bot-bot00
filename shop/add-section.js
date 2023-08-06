module.exports = client => {
const {PermissionsBitField, AuditLogEvent, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
const fs = require('fs');  
const settingsBuffer = fs.readFileSync('DataBases/ShopSettings.json');
const settings = JSON.parse(settingsBuffer)
const Profix = settings.ShopSettings.Profix 
const { Database } = require('st.db')
client.on('messageCreate', async message => {
if (message.author.bot) return
if (message.content === `${Profix}اضافة-قسم`) {
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
.setDescription(`**هيا تقدم و أضغط على الزر و إملأ بياناته دون تردد**`)
.setColor(`${RoleColor}`)
.setTitle(`إنشاء قسما`)
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
const Sections = new ActionRowBuilder()
.setComponents(
new ButtonBuilder()
.setCustomId('Sections')
.setStyle(ButtonStyle.Success)
.setEmoji('➕')
)
message.channel.send({content:`**هيا أفعلها**`,embeds: [embed], components: [Sections] })
}
})
client.on('interactionCreate', async (interaction) => {
if (interaction.isButton()) {
if (interaction.customId === 'Sections') {
const modal = new ModalBuilder()
.setTitle('Sections')
.setCustomId('Sections')
const q1 = new TextInputBuilder()
.setCustomId('q1')
.setLabel(`اسم القسم`)
.setMinLength(2)
.setMaxLength(25)
.setRequired(true)
.setStyle(TextInputStyle.Short)
const q2 = new TextInputBuilder()
.setCustomId('q2')
.setLabel(`اسم القاعدة`)
.setMinLength(2)
.setMaxLength(25)
.setStyle(TextInputStyle.Short)
.setRequired(true)
const q3 = new TextInputBuilder()
.setCustomId('q3')
.setLabel(`رسالة القسم`)
.setMinLength(1)
.setMaxLength(500)
.setStyle(TextInputStyle.Paragraph)
.setRequired(true)
const rows = [q1,q2,q3].map(
(component) => new ActionRowBuilder().addComponents(component)
)
modal.addComponents(...rows);
interaction.showModal(modal);
}
}
if (interaction.customId === 'Sections') {
const server = client.guilds.cache.get(interaction.message.guildId);
const channel = server.channels.cache.get(interaction.message.channelId);
const fetchedMessage = await channel.messages.fetch(interaction.message.id);
const q1 = interaction.fields.getTextInputValue('q1') || `لم يجاوب/تجاوب`;
const q2 = interaction.fields.getTextInputValue('q2') || `لم يجاوب/تجاوب`;
const q3 = interaction.fields.getTextInputValue('q3') || `لم يجاوب/تجاوب`;
const SectionsNew = new Database(`Sections/${q2}.json`) 
 SectionsNew.set(`key`, {
    SectionsName: q1,
    SectionsMessage: q3
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
.setDescription(`**اسم القسم : ${q1}\nاسم القاعدة : ${q2}\nرسالة القسم : ${q3}**`)
.setColor(`${RoleColor}`)
.setTitle(`أنشئ قسما جديدا`)
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
const Sections = new ActionRowBuilder()
.setComponents(
new ButtonBuilder()
.setCustomId('Sections')
.setStyle(ButtonStyle.Danger)
.setDisabled(true)
.setEmoji('➕')
)
fetchedMessage.edit({content:`**تمت بنجاح!**`,embeds: [embed], components: [Sections] })
interaction.reply({ content: `**تم الإضافة**`, ephemeral: true})
}
})
}