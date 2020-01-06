class User {
  constructor(userId, name, channel) {
    this.userId = userId;
    this.name = name;
    this.channel = channel;
    this.timeout = null;
    this.possibleData = null;
    this.stage = {
      dateSelected: false,
      timeSelected: false
    }
  }
}

module.exports = User;
