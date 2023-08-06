module.exports = client => {
const {PermissionsBitField, AuditLogEvent, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
const fs = require('fs');  
const settingsBuffer = fs.readFileSync('DataBases/ShopSettings.json');
const settings = JSON.parse(settingsBuffer)
const Profix = settings.ShopSettings.Profix 
const { Database } = require('st.db')
const basePath = 'Sections/';
let excludedFiles = ['key'];
client.on('messageCreate', (message) => {
if (message.author.bot) return
if (message.content === `${Profix}العناصر`) {
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
.setDescription(`**ألغت**`);
m.edit({ embeds: [embed] }); 
message.delete()
collector.stop()
}
if (!isNaN(selectedNumber) && selectedNumber >= 1 && selectedNumber <= Object.keys(SectionsObject).length) {
const selectedSection = SectionsObject[selectedNumber];
message.delete()
let Sections = new Database(`${selectedSection.filePath}`);
const sectionsKeys = Sections.keysAll();
let messageContent = {}
let counter = 1; 
sectionsKeys.forEach((key, index) => {
  if (!excludedFiles.includes(key)) {
    let x = Sections.get(key);
    messageContent[counter] = { 
      number: counter,
      item: x.Item,
      ItemPassword: x.ItemPassword,
      Price: x.Price,
      Advantages: x.Advantages,
      key: key,
      filePath: selectedSection.filePath
    };
    counter++;
  }
});
if(!Object.keys(messageContent).length) {
const embed = new EmbedBuilder()
.setColor(`${RoleColor}`)
.setTitle(`العناصر`)
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
.setDescription(`**ليس هناك عناصر في الوقت الحالي**`);
m.edit({content: `` ,embeds: [embed] })
return
}
const embed = new EmbedBuilder()
.setColor(`${RoleColor}`)
.setTitle(`العناصر`)
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
.setDescription(`**${Object.values(messageContent).map((section) =>`${section.number} - السعر : ${section.Price}\nالمميزات ${section.Advantages}`).join('\n')}**`);
m.edit({content: `**أختر عنصرا**` ,embeds: [embed] })
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
m.edit({ content:`**لم تتم!**`,embeds: [embed] });
  }
});
})
  }
});
}