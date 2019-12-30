const miko = require('./miko');
const mikoCreds = require('./miko-creds');
const { google } = require('googleapis');

const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
const { client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY
      } = mikoCreds;

const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
)

const { GOOGLE_PROJECT_NUMBER } = process.env;
const calendar = google.calendar({
  version: 'v3',
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient
})
class ScheduleSession {
  constructor(calendarApiClient, calendarId) {
    this.sessions = {}
    this.calendarApi = calendarApiClient
    this.calendarId = calendarId
    this.currentWeeksSchedule = null;
  }
  startSession(data) {
    const { user, channel } = data;
    this.sessions[user] = {}
    this.sessions[user].channel = channel;
    this.handleTimeUpdate(user)
    this.getCurrentSchedule()
    console.log("session starting")
  }
  getCurrentSchedule() {
    this.calendarApi.events.list({
      calendarId: this.calendarId,
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    },(err, res) => {
      if(err) {
        console.log(err)
      } else {
        console.log(res)
      }
    })
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

const sessions = new ScheduleSession(calendar, process.env.CALENDAR_ID);

module.exports = sessions;
