const SlackBot = require('slackbots');
const { help } = require('./help');

const bot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  name: "mikobot"
});

const commands = {
  help
}
console.log(commands);

bot.on('message', data => {
  if(data.type !== 'message') return;
  const message = data.text.split(" ");
  if(message[0] !== 'miko') return;
  if(message[1] === undefined) {
    bot.postMessage(data.channel, `
  Hello~~ \n For a list of my commands please type "miko help" 0W0.
  `)
  return;
  }
  if(commands.hasOwnProperty(message[1])) {
    commands[message[1]](bot, data);
  }
})
