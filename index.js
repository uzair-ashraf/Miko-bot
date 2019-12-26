const miko = require('./miko');
const { help } = require('./help');
const { question } = require('./question');
const { schedule } = require('./schedule');
const sessions = require('./scheduleSession');

const commands = {
  help,
  question,
  schedule
}

miko.on('message', data => {
  if(data.type !== 'message') return;
  const message = data.text.split(" ");
  if(message[0] !== 'miko') return;
  if(sessions.isInSession(data.user)) {
    schedule(data, message[1]);
    return
  }
  if(message[1] === undefined) {
    miko.postMessage(data.channel, `
  Hello~~ \n For a list of my commands please type "miko help" uwu.
  `)
  return;
  }
  if(commands.hasOwnProperty(message[1])) {
    commands[message[1]](data);
  } else {
    miko.postMessage(data.channel, `
    >.< Miko doesn't understand what you're saying
    `)
  }
})
