const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const question = (bot, data) => {
  bot.postMessage(data.channel, `
  So you wan't to know how to ask an instructor a question I see.
  `)
  .then(() => setTimeout(() => {
    bot.postMessage(data.channel, `
  Unfortunately with a large number of students it can be difficult for us to
 meet the demands of all students without some uniformity in all questions.
  `)
  .then(() => setTimeout(() => {
    bot.postMessage(data.channel, `
   Lets start with examples..
    `)
    .then(() => setTimeout(() => {
    bot.postMessage(data.channel, `
   Here is a bad question.
    `)
      .then(() => setTimeout(() => {
        bot.postMessage(data.channel, `
        @LFZ-Teacher please help, I'm lost
        `)
          .then( () => setTimeout( () => {
            bot.postMessage(data.channel, `
            As you can see questions like that can make things difficult for us to interpret.
            `)
          }, 2200))
            .then( () => setTimeout( () => {
              console.log(process.env.SLACK_TOKEN)
              const imageData = new FormData();
              imageData.append("file", fs.createReadStream("images/question-example.JPG"))
              console.log(imageData);
              axios({
                url: 'https://slack.com/api/files.upload',
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: {
                  token: process.env.SLACK_TOKEN,
                  channel: data.channel,
                  file: imageData
                }
              })
              .then(data => console.log(data))
              .catch(err => console.log(err))
              // bot.postMessage(data.channel, `
              // Here is an example of a good question
              // https://drive.google.com/uc?export=view&id=1-uqJDz895Xf-GbRoKxBMHJA71nlcHyU_
              // `)
            }, 2200))
      },2200))
    }, 2200))
  }, 2200))
  }, 2200))
}

module.exports = {
  question
}
