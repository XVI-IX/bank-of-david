require('dotenv').config();

const request = require("request");
const options = {
  'method': 'GET',
  'url': 'https://api.flutterwave.com/v3/banks/NG',
  'headers': {
    'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`
  }
};

request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});