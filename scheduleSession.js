const miko = require('./miko');

class ScheduleSession {
  constructor() {
    this.sessions = {}
  }
  startSession(data) {
    const { user, channel } = data;
    this.sessions[user] = {}
    this.sessions[user].channel = channel;
    this.handleTimeUpdate(user)
    console.log("session starting")
  }
  isInSession(userId) {
    return !!this.sessions[userId]
  }
  handleTimeUpdate(userId) {
    clearTimeout(this.sessions[userId].timeout)
    this.sessions[userId].timeout = setTimeout(() => this.terimateSession(userId), 1000*30)
    console.log("timeout set")
  }
  terimateSession(userId) {
    miko.postMessage(this.sessions[userId].channel, `
    Unfortunately your scheduling session has expired due to inactivity.
    Please message me again when you are ready to set a time to meet.
    `)
    console.log("session terminated")
    delete this.sessions[userId]
  }
}

const sessions = new ScheduleSession();

module.exports = sessions;
