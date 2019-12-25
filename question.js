const { imageUpload } = require('./imageUpload');
const { delay } = require('./delay');

const question = (bot, data) => {
  bot.postMessage(data.channel, `
  So you wan't to know how to ask an instructor a question I see.
  `)
    .then(() => delay(2200))
    .then(() => bot.postMessage(data.channel, `
    Unfortunately with a large number of students it can be difficult for us to
  meet the demands of all students without some uniformity in all questions.
     `))
    .then(() => delay(2200))
    .then(() => bot.postMessage(data.channel, `
    Lets start with examples..
    `))
    .then(() => delay(2200))
    .then(() => bot.postMessage(data.channel, `
    Here is a bad question.
    `))
    .then(() => delay(2200))
    .then(() => bot.postMessage(data.channel, `
    @LFZ-Teacher please help, I'm lost
    `))
    .then(() => delay(2200))
    .then(() => bot.postMessage(data.channel, `
    As you can see questions like that can make things difficult for us to interpret.
    `))
    .then(() => delay(2200))
    .then(() => bot.postMessage(data.channel, `
    Here is an example of a good question.
    `))
    .then(() => delay(2200))
    .then(() => {
      bot.postMessage(data.channel, `
      @LFZ-Teacher I am having an issue.  I have tried
    logging things to the console outside of the for loop
    but nothing inside the for loop is working.
      `)
      .then( () => imageUpload(data.channel, "images/question-example-1.JPG"))
    })
    .then(() => delay(2200))
    .then(() => bot.postMessage(data.channel, `
    As you can see sending screenshots help us a ton in speeding up the process.
    The problem here is that the for loop never runs, because i at 0 is not greater than 3.
    `))
    .then(() => delay(2500))
    .then(() => bot.postMessage(data.channel, `
    Here is an even better example of a question.
    `))
    .then(() => delay(2200))
    .then(() => bot.postMessage(data.channel, `
    @LFZ-Teacher I am having an issue with my object, here is my code, and the error
    that I am getting.
    `)
    .then(() => imageUpload(data.channel, "images/question-example-2.JPG"))
    .then(() => imageUpload(data.channel, "images/question-example-3.JPG"))
    )
    .then(() => delay(2200))
    .then(() => bot.postMessage(data.channel, `
    The more context we get, the better we can help you!
    `))
    .then(() => delay(2200))
    .then(() => bot.postMessage(data.channel, `
    That's all I have for you, for more information please message an instructor.
    `))

}

module.exports = {
  question
}
