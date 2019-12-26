const miko = require('./miko');
const sessions = require('./scheduleSession');


const schedule = (data, message) => {
  if(message) {
    console.log(message);
    return
  }
  miko.postMessage(data.channel, `
    Miko is starting a scheduling session for you ~
  `)
  sessions.startSession(data)
}

module.exports = { schedule }
