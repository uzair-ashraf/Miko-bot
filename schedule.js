const sessions = require('./scheduleSession');


const schedule = (data, message) => {
  if(!message) {
    sessions.startSession(data)
    return
  }
  console.log(message);
  sessions.handleResponse(data, message);
}

module.exports = { schedule }
