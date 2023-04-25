require('dotenv').config();

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send("We out");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("listening on port....")
})