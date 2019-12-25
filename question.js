const { imageUpload } = require('./imageUpload');
const { delay } = require('./delay');

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
              imageUpload(data.channel, "images/question-example.JPG")
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
