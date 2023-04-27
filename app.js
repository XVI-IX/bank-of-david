require('dotenv').config();
const connectDB = require("./db/connect");

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send("We out");
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    })
  } catch (err) {
    console.log(err);
  }
}

start();