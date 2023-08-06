module.exports = client => {
const {PermissionsBitField, AuditLogEvent, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
const fs = require('fs');  
const settingsBuffer = fs.readFileSync('DataBases/ShopSettings.json');
const settings = JSON.parse(settingsBuffer)
const Profix = settings.ShopSettings.Profix 
const { Database } = require('st.db')
const basePath = 'Sections/';
client.on('messageCreate', (message) => {
if (message.author.bot) return
if (message.content === `${Profix}اضافة-عنصر`) {
if(!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return   
const files = fs.readdirSync(basePath);
if (files.length === 0) return message.channel.send(`**ليس هناك اقسام في الوقت الحالي**`);
const author = message.guild.members.cache.get(message.author.id);
const RoleColor = [];    
const highestRoleWithColor = author.roles.cache.filter(role => role.color && role.color !== 0).sort((a, b) => b.position - a.position).first();
if (highestRoleWithColor) {
const colorHex = highestRoleWithColor.color.toString(16).padStart(6, '0');
RoleColor.push(`#${colorHex}`)
} else {
RoleColor.push(`#F2F3F5`)
} 
let SectionsObject = {}; 
files.forEach((file, index) => {
  let Sections = new Database(`${basePath}${file}`);
  let SectionsGet = Sections.get('key');
  SectionsObject[index + 1] = { 
    number: index + 1,
    SectionsName: SectionsGet.SectionsName,
    file: file,
    filePath: `${basePath}${file}`
  };
});
const embed = new EmbedBuilder()
.setColor(`${RoleColor}`)
.setTitle('قائمة الأقسام:')
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
.setDescription(`**${Object.values(SectionsObject).map((section) =>`${section.number} - ${section.SectionsName} (${section.file})`).join('\n')}\nللإلغاء أكتب 0**`);
message.channel.send({ embeds: [embed] }).then(m => {
const filter = (message) => {
  if (message.author.id !== client.user.id) {
    const input = message.content.trim().toLowerCase();
    return (!isNaN(input) && Number(input) >= 0 && Number(input) <= Object.keys(SectionsObject).length);
  }
  return false;
};

const collector = message.channel.createMessageCollector({
  filter,
  max: 1,
  time: 600000
});

collector.on('collect', async (message) => {
  const input = message.content.trim();
  const selectedNumber = parseInt(input);
if(selectedNumber === 0) {
const embed = new EmbedBuilder()
.setColor(`${RoleColor}`)
.setTitle(`تم الإلغاء`)
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
.setDescription(`**لم يضاف شيئا**`);
m.edit({ embeds: [embed] }); 
message.delete()
collector.stop()
}
    if (!isNaN(selectedNumber) && selectedNumber >= 1 && selectedNumber <= Object.keys(SectionsObject).length) {
const selectedSection = SectionsObject[selectedNumber];
const item = new ActionRowBuilder()
.setComponents(
new ButtonBuilder()
.setCustomId('item')
.setStyle(ButtonStyle.Success)
.setEmoji('➕')
)
const embed = new EmbedBuilder()
.setColor(`${RoleColor}`)
.setTitle(`العناصر`)
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
.setDescription(`**لضافة عنصر اضغط على الزر**`);
message.delete()
m.edit({content: `${selectedSection.filePath}` ,embeds: [embed], components: [item] });
}
});
collector.on('end', (collected, reason) => {
  if (reason === 'time') {
const embed = new EmbedBuilder()
.setColor(`${RoleColor}`)
.setTitle(`لم تتم بنجاح`)
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
.setDescription(`**إنتهى الوقت**`);
m.edit({ embeds: [embed] });
  }
});
})
  }
});
client.on('interactionCreate', async (interaction) => {
if (interaction.isButton()) {
if (interaction.customId === 'item') {
const modal = new ModalBuilder()
.setTitle('item')
.setCustomId('item')
const q1 = new TextInputBuilder()
.setCustomId('q1')
.setLabel(`العنوان`)
.setMinLength(2)
.setMaxLength(25)
.setRequired(true)
.setStyle(TextInputStyle.Short)
const q2 = new TextInputBuilder()
.setCustomId('q2')
.setLabel(`كلمة المرور`)
.setMinLength(8)
.setMaxLength(25)
.setStyle(TextInputStyle.Short)
.setRequired(true)
const q3 = new TextInputBuilder()
.setCustomId('q3')
.setLabel(`السعر`)
.setMinLength(1)
.setMaxLength(10)
.setStyle(TextInputStyle.Short)
.setRequired(true)
const q4 = new TextInputBuilder()
.setCustomId('q4')
.setLabel(`المميزات`)
.setMinLength(1)
.setMaxLength(500)
.setStyle(TextInputStyle.Paragraph)
.setRequired(true)
const rows = [q1,q2,q3,q4].map(
(component) => new ActionRowBuilder().addComponents(component)
)
modal.addComponents(...rows);
interaction.showModal(modal);
}
}
if (interaction.customId === 'item') {
const itemcontent = interaction.message.content
const server = client.guilds.cache.get(interaction.message.guildId);
const channel = server.channels.cache.get(interaction.message.channelId);
const fetchedMessage = await channel.messages.fetch(interaction.message.id);
const q1 = interaction.fields.getTextInputValue('q1') || `لم يجاوب/تجاوب`;
const q2 = interaction.fields.getTextInputValue('q2') || `لم يجاوب/تجاوب`;
const q3 = interaction.fields.getTextInputValue('q3') || `لم يجاوب/تجاوب`;
const q4 = interaction.fields.getTextInputValue('q4') || `لم يجاوب/تجاوب`;
function generateRandomString() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const length = Math.floor(Math.random() * 20) + 1;
  let randomString = "";
  for (let i = 0; i < length; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
}
const randomString = generateRandomString();
const ItemNew = new Database(`${itemcontent}`) 
const item = ItemNew.get(`key`)
 ItemNew.set(`${q3}${randomString}${q3}`, {
    Item: q1,
    ItemPassword: q2,
    Price: q3,
   Advantages: q4
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
.setDescription(`**العنصر : ${q1}\n كلمة المرور : ${q2}\nالسعر : ${q3}\nالمميزات ${q4}\nإلى : ${item.SectionsName}**`)
.setColor(`${RoleColor}`)
.setTitle(`أنشئ عنصرا جديدا`)
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
let embed2 = new EmbedBuilder()
.setDescription(`**أرسلت المعلومات في الخاص**`)
.setColor(`${RoleColor}`)
.setTitle(`أنشئ عنصرا جديدا`)
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
const itemedd = new ActionRowBuilder()
.setComponents(
new ButtonBuilder()
.setCustomId('item')
.setStyle(ButtonStyle.Danger)
.setDisabled(true)
.setEmoji('➕')
)
author.send({content:`**تمت بنجاح!**`,embeds: [embed] })
fetchedMessage.edit({content:`**تمت بنجاح!**`,embeds: [embed], components: [itemedd] })
interaction.reply({ content: `**تم الإضافة**`, ephemeral: true})
}
})
}