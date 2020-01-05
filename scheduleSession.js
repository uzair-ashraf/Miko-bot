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
    this.sessions[user].name = miko.getUsers()._value.members.find(userProfile => {
      return userProfile.id === user
    }).real_name;
    const now = new Date();
    const today = this.getToday(now);
    if (today === "Saturday" || today === "Sunday") {
      const followingWeek = this.getFollowingWeek(now, today);
      miko.postMessage(channel, `
      Hello ${this.sessions[user].name.split(" ")[0]}
      Miko is starting a scheduling session for you.
      Unfortunately LearningFuze is closed today.
      Please select one of the following days:\n
      ${followingWeek.reduce((acc, day) => {
        return acc + day.forUser + "\n"
      }, '')}

      When responding please use the same format as displayed.
      For example your response can look like:

      "miko 2007-08-31"
  `)
    }
    this.handleTimeUpdate(user)
    this.getTodaysSchedule()
    console.log("session starting")
  }
  handleResponse({ user }, command) {
    console.log(user)
    console.log(command);
  }
  getTodaysSchedule() {
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
        console.log(res.data.items)
      }
    })
  }
  getToday(date) {
    const daysOfWeek = ["Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"];
    return daysOfWeek[date.getDay()];
  }
  getFollowingWeek(date, today) {
    const followingWeek = [];
    let currentTime = date.getTime();
    let counter = today === "Saturday" ? 2 : 1;
    let weekCondition = counter === 2 ? 6 : 5
      while (counter <= weekCondition) {
        const dayNextWeek = {}
        dayNextWeek.forApi = new Date(currentTime + counter * 24 * 60 * 60 * 1000).toISOString()
        dayNextWeek.forUser = dayNextWeek.forApi.split("T")[0]
        followingWeek.push(dayNextWeek)
        counter++
      }
      return followingWeek
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
