module.exports = client => {
const {PermissionsBitField, AuditLogEvent, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
const fs = require('fs');  
const settingsBuffer = fs.readFileSync('DataBases/ShopSettings.json');
const settings = JSON.parse(settingsBuffer)
const Profix = settings.ShopSettings.Profix 
const { Database } = require('st.db')
const basePath = 'Sections/';
let excludedFiles = ['key'];
let Buyann = []
client.on('messageCreate', (message) => {
if (message.author.bot) return
if (message.content === `${Profix}شراء`) {
const key = `Buy_${message.author.id}`;
if (Buyann.hasOwnProperty(key)) return message.reply({content: `**لديك عملية شرائية تتم الآن**`})
const files = fs.readdirSync(basePath);
if (files.length === 0) return message.channel.send(`**ليس هناك اقسام في الوقت الحالي**`);
const author = message.guild.members.cache.get(message.author.id);
const Transfers = new Database(`DataBases/ShopSettings.json`) 
let VLR = Transfers.get(`Transfers`)
let owner = message.guild.members.cache.get(VLR.TransfersFOR);
let bot = message.guild.members.cache.get(VLR.Bot);  
let Channel = message.guild.channels.cache.get(VLR.Channel);  
if(!owner && !bot && !Channel) return message.reply({ content: `**هناك شيء ناقص**`})
const RoleColor = [];    
let BNPm = []
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
.setDescription(`**${Object.values(SectionsObject).map((section) =>`${section.number} - ${section.SectionsName}`).join('\n')}\nللإلغاء أكتب 0**`);
message.channel.send({ embeds: [embed] }).then(m => {
Buyann[key] = 0;
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
  time: 60000
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
delete Buyann[key]; 
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
delete Buyann[key]; 
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
.setDescription(`**${Object.values(messageContent).map((section) =>`${section.number} - السعر : ${section.Price}\nالمميزات : ${section.Advantages}`).join('\n')}**`);
m.edit({content: `**أختر عنصرا**` ,embeds: [embed] }).then(n=> {
const filter = (message) => {
  if (message.author.id !== client.user.id) {
    const input = message.content.trim().toLowerCase();
    return (!isNaN(input) && Number(input) >= 0 && Number(input) <= Object.keys(messageContent).length);
  }
  return false;
};

const collector = message.channel.createMessageCollector({
  filter,
  max: 1,
  time: 300000
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
n.edit({ content:`**تم الإلغاء!**`,embeds: [embed] }); 
message.delete()
collector.stop()
delete Buyann[key]; 
}
if (!isNaN(selectedNumber) && selectedNumber >= 1 && selectedNumber <= Object.keys(messageContent).length) { 
await author.send(`نتأكد من أن الخاص مفتوح`).catch((v)=> {
const embed = new EmbedBuilder()
.setColor(`${RoleColor}`)
.setTitle(`عملية شرائية`)
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
.setDescription(`**خاصك مقفل**`);
m.edit({content: `` ,embeds: [embed] })
delete Buyann[key]
collector.stop()
return
})
const VBNPO = messageContent[selectedNumber];
await BNPm.push(VBNPO.key);
await excludedFiles.push(VBNPO.key);
let Price = Math.floor(VBNPO.Price*20/19+1)
const filter = (response) =>  response.content.startsWith(`**:moneybag: | ${author.user.username}, has transferred \`$${VBNPO.Price}\``) && response.author.id === bot.id && response.content.includes(`${owner.id}`) && response.content.includes(Number(VBNPO.Price))
const embed = new EmbedBuilder()
.setColor(`${RoleColor}`)
.setTitle(`عملية شرائية`)
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
.setDescription(`**عليك تحويل \`$${Price}\` إلى ${owner} و التاكد تأكدًا أن حسابك خاصه مفتوح\n\`\`\`js\n/credits user:${owner.id} amount:${Price}\`\`\`**`);
m.edit({content: `**لديك 5 دقائق**` ,embeds: [embed] })
const collector = message.channel.createMessageCollector({
  filter,
  max: 1,
  time: 300000
});
collector.on('collect', async (message) => {
let buy = new Database(`${VBNPO.filePath}`);
let buyGet = buy.get(`${VBNPO.key}`)
const embedBuy = new EmbedBuilder()
.setColor(`${RoleColor}`)
.setTitle(`عملية شرائية`)
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
 .addFields(
{ name: `**العنصر**`, value: `**\`${buyGet.Item}\`**`, inline: true },
{ name: `**كلمة المرور**`, value: `**\`${buyGet.ItemPassword}\`**`, inline: true },
{ name: `**المميزات**`, value: `**${buyGet.Advantages}**`, inline: true },
{ name: `**قيد التحويل و الإقفال**`, value: `${buyGet.Price} من حَ ${owner}(${owner.id} - **البنك**)\n${buyGet.Price} إلى حَ${author}(${author.id} - **المبيعات**)\n\n${buyGet.Price} من حَ المبيعات\n${buyGet.Price} إلى حَ أ.خ`, inline: true }   
)
const embed = new EmbedBuilder()
.setColor(`${RoleColor}`)
.setTitle(`عملية شرائية`)
.setTimestamp()
.setAuthor({
  name: author.user.username,
  iconURL: author.displayAvatarURL({ dynamic: true, size: 4096 })
})
.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
.setDescription(`**أرسلت معلومات العنصر في الخاص**`);
m.edit({ content:`**تمت بنجاح!**`,embeds: [embed] });
author.send({ embeds: [embedBuy] });
buy.delete(`${VBNPO.key}`)
delete Buyann[key]; 
Channel.send(`**:coin: \`$${buyGet.Price}\`\nمن ${author}\nإلى ${owner}**`);
})
collector.on('end', (collected, reason) => {
delete Buyann[key]; 
const fruitToRemove = BNPm[0];
const indexToRemove = excludedFiles.indexOf(fruitToRemove);
if (indexToRemove !== -1) excludedFiles.splice(indexToRemove, 1);
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
n.edit({ content:`**لم تتم!**`,embeds: [embed] });
delete Buyann[key]; 
const fruitToRemove = BNPm[0];
const indexToRemove = excludedFiles.indexOf(fruitToRemove);
if (indexToRemove !== -1) excludedFiles.splice(indexToRemove, 1);
collector.stop()
  }
});
}
})
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
n.edit({ content:`**لم تتم!**`,embeds: [embed] });
delete Buyann[key]; 
const fruitToRemove = BNPm[0];
const indexToRemove = excludedFiles.indexOf(fruitToRemove);
if (indexToRemove !== -1) excludedFiles.splice(indexToRemove, 1);
collector.stop()
  }
});
})
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
delete Buyann[key]; 
  }
});
})
  }
});
}