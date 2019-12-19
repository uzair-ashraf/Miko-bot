const help = (bot, data) => {
  bot.postMessage(data.channel, `
  Please remember I don't hear very well and I need you to say miko before any of my commands.
  help: List of commands
  `)
}

module.exports = {
  help
}
