const miko = require('./miko');
const sessions = require('./scheduleSession');


const schedule = (data, message) => {
  if(message) {
    console.log(message);
    return
  }
  sessions.startSession(data)
}

module.exports = { schedule }
