require('events').EventEmitter.defaultMaxListeners = 150;
require('events').EventEmitter.defaultMaxListeners = 400;

const express = require('express');

const app = express();

const path = require('path');

app.get('/', function (req, res) {
    res.send(`started`);
});

app.listen(3000, () => {
  console.log('server started');
});

const fs = require('fs');  

const client = require('./clients/discord.js')

process.on("unhandledRejection", error => {
  return console.log(error)
});
process.on("rejectionHandled", error => {
  return console.log(error)
});
process.on("uncaughtException", error => {
  return console.log(error)
});

setTimeout(() => {
  if (!client || !client.user) {
    console.log(`The bot is offline. Rebooting`)
    process.kill(1);
  } else {
    console.log(`The bot is online`)
  }
}, 60000); 

let Folders = fs.readdirSync('loader').filter(file => file.endsWith('.js'))
  for  (const file of Folders) {
    require(`./loader/${file}`)(client)
  }

const axios = require('axios');

setInterval(() => {
axios.get(process.env.link).catch(err => {});
}, 60000)
