require('dotenv').config()
const axios = require('axios');

const send = async (dataBody) => {
  const data = {
    "account_bank": dataBody.account_bank,
    "account_number": dataBody.account_number,
    "amount": dataBody.amount,
    "narration": dataBody.narration,
    "currency": "NGN",
    "debit_currency": "NGN"
  }

  const config = {
    method: 'post',
    url: 'https://api.flutterwave.com/v3/transfers',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`
    },
    json : data
  };

  const response = await axios(config)
  if (response.status === 200) {
    return (response.data);
  } else {
    console.error(error.message);
  }
}

module.exports = send;