module.exports = client => {
const { PermissionsBitField, AttachmentBuilder, EmbedBuilder, ButtonBuilder,ButtonStyle,ModalBuilder,TextInputStyle,TextInputBuilder, ActionRowBuilder, ComponentType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js') 
const fs = require('fs');  
const settingsBuffer = fs.readFileSync('DataBases/ShopSettings.json');
const settings = JSON.parse(settingsBuffer);
const profix = settings.ShopSettings.Profix
client.on('messageCreate', async (message) => {
  if (message.content.startsWith(`${profix}help`)) {  
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
 .addFields(
        { name: `${profix}اضافة-قسم`, value: `لضافة قسم جديد`, inline: true },
        { name: `${profix}حذف-قسم`, value: `لحذف قسم`, inline: true },
        { name: `${profix}قائمة-الاقسام`, value: `لعرض جميع الأقسام`, inline: true },
        { name: `${profix}اضافة-عنصر`, value: `لضافة عنصر`, inline: true },
   { name: `${profix}حذف-عنصر`, value: `لحذف عنصر`, inline: true },
   { name: `${profix}العناصر`, value: `لعرض العناصر`, inline: true },
   { name: `${profix}التحويلات`, value: `لتحديد لمن التحويل و بوت التحويل و قناة ارسال التحويلات`, inline: true },
   { name: `${profix}شراء`, value: `لشراء عنصر`, inline: true }
      )
  .setColor(`${RoleColor}`)
  .setTitle("**أوامر البوت**")
  .setTimestamp()
.setAuthor({
  name: author.user.tag,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
message.reply({content:`${author}`,embeds: [embed]})  
}
})
}