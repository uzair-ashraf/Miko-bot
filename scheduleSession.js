const miko = require('./miko');
const mikoCreds = require('./miko-creds');
const User = require('./user');
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
    const name = miko.getUsers()._value.members.find(userProfile => {
      return userProfile.id === user
    }).real_name;
    this.sessions[user] = new User(user, name, channel);

    console.log(this.sessions[user]);

    const now = new Date();
    const today = this.getToday(now);
    const hour = now.getHours();
    if (today === "Saturday" || today === "Sunday") {
      this.handleWeekendRequest(user, now, today);
    }
    this.handleTimeUpdate(user)
    console.log("session starting")
  }
  handleResponse({ user }, command) {
    this.handleTimeUpdate(user)
    if(command === "terminate") {
      this.terimateSession(user, true)
      return;
    }
    console.log(user)
    console.log(command);
    if(!this.sessions[user].stage.dateSelected) {
      const dateToSelect = this.sessions[user].possibleDates.find(dateObj => {
        return command === dateObj.forUser
      })
      if(!dateToSelect) {
        miko.postMessage(this.sessions[user].channel, `
        Miko did not understand that date, please check your format and try again
        `)
        return;
      }
      this.sessions[user].stage.dateSelected = true;
      miko.postMessage(this.sessions[user].channel, `
      Sounds good! Give me a moment while I check what times are free on that day.
      `)
      .then(() => {
        this.getSchedule(dateToSelect);
      })
      return;
    }
      miko.postMessage(this.sessions[user].channel, `
          >.< ${this.sessions[user].name.split(" ")[0]}..
          I did not understand that command,
          You are currently in a scheduling session, so I wont
          be able to understand any other request
          To exit the session send "miko terminate"
          Or simply wait out the 30 second time out.
          `)
  }
  handleWeekendRequest(user, dateObj, today) {
    this.sessions[user].possibleDates = this.getFollowingWeek(dateObj, today);
    miko.postMessage(this.sessions[user].channel, `
      Hello ${this.sessions[user].name.split(" ")[0]}
      Miko is starting a scheduling session for you.
      Unfortunately Uzair cannot host a meeting on a weekend.
      Please select one of the following days for next week:\n
      ${this.sessions[user].possibleDates.reduce((acc, day) => {
      return acc + day.forUser + "\n"
    }, '')}

      When responding please use the same format as displayed.
      For example your response can look like:

      "miko 2007-08-31"
  `)
  }
  getSchedule(day) {
    const selectedDay = new Date(day.forApi);
    const nextDay = new Date(selectedDay.getTime() + (24 * 60 * 60 * 1000)).toISOString()
    this.calendarApi.events.list({
      calendarId: this.calendarId,
      timeMin: selectedDay,
      timeMax: nextDay,
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
  terimateSession(user, requested) {
    if(requested) {
      clearTimeout(this.sessions[user].timeout)
      miko.postMessage(this.sessions[user].channel, `
      X.X SCHEDULING SESSION TERMINATED
      `)
    } else {
      miko.postMessage(this.sessions[user].channel, `
    Unfortunately your scheduling session has expired due to inactivity.
    Please message me again when you are ready to set a time to meet.
    `)
    }
    console.log("session terminated")
    delete this.sessions[user]
  }
}

const sessions = new ScheduleSession(calendar, process.env.CALENDAR_ID);

module.exports = sessions;
