const SlackBot = require('slackbots');

const miko = new SlackBot({
  token: process.env.SLACK_TOKEN,
  name: "mikobot"
});

module.exports = miko;
