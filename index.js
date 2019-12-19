const SlackBot = require('slackbots');

const bot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  name: "mikobot"
});

bot.on('message', data => {
  if(data.type !== 'message') return;
  const message = data.text.split(" ");
  if(message[0] !== 'miko') return;
    // bot.postMessage(data.user, 'no u');
    // bot.postMessageToUser(data.user, message);
  // bot.openIm(data.user)
  // .then(data => console.log(data))
  console.log(data.channel);
  bot.postMessage(data.channel, 'Hello!')
})
