const miko = require('./miko');

const help = (data) => {
  miko.postMessage(data.channel, `
  Please remember I don't hear very well and I need you to say miko before any of my commands.
 help: List of commands
 question: How to ask an instructor a question
  `)
}

module.exports = {
  help
}
