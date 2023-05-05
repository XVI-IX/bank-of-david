require('dotenv').config();
const connectDB = require("./db/connect");

const express = require('express');
const app = express();
const session = require('express-session');

// Middleware imports
const { limiter, auth } = require("./middleware");

// Router Imports
const authRouter = require("./routes/auth");
const customerRouter = require("./routes/customer");


app.use(express.json());
app.use(session({
  secret: process.env.SECRET,
  cookie: {
    maxAge: 10 * 60 * 1000,
  },
  saveUninitialized: false,
  resave: false
}))

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/customers', auth, limiter, customerRouter);


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