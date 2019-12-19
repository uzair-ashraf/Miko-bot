const SlackBot = require('slackbots');
const { help } = require('./help');
const { question } = require('./question');

const bot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  name: "mikobot"
});

const commands = {
  help,
  question
}
bot.on('message', data => {
  if(data.type !== 'message') return;
  const message = data.text.split(" ");
  if(message[0] !== 'miko') return;
  console.log(bot);
  if(message[1] === undefined) {
    bot.postMessage(data.channel, `
  Hello~~ \n For a list of my commands please type "miko help" uwu.
  `)
  return;
  }
  if(commands.hasOwnProperty(message[1])) {
    commands[message[1]](bot, data);
  }
})
