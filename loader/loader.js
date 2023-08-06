module.exports = async client => {
  let fs = require('fs')
  let factorFolder = fs.readdirSync('shop').filter(file => file.endsWith('.js'))
  for (const file of factorFolder) {
    let event = require('../shop/' + file)

    await event(client)
  }
}