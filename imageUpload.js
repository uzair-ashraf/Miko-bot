const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const imageUpload = (channel, imagePath) => {
  const imageData = new FormData();
  imageData.append("file", fs.createReadStream(imagePath))
  const imageHeaders = imageData.getHeaders();
 return axios({
    url: 'https://slack.com/api/files.upload',
    method: 'POST',
    headers: {
      ...imageHeaders,
    },
    params: {
      token: process.env.SLACK_TOKEN,
      channels: channel,
    },
    data: imageData
  })
}

module.exports = { imageUpload }
