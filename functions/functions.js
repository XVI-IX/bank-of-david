const axios = require('axios');

require('dotenv').config();

const config = {
  headers: {
    apikey: process.env.NUMBERVERIFY
  }
}

const verifyNumber = async (phoneNumber) => {
  const result = await axios.get(`https://api.apilayer.com/number_verification/validate?number=${phoneNumber}`, config);
  const response = await result;

  return response.data.valid;
}

const check = async (phoneNumber) => {
  const valid = await verifyNumber(phoneNumber);
  console.log(valid);
}

module.exports = {
  check,
}

