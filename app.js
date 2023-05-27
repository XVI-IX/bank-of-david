require('dotenv').config();
const connectDB = require("./db/connect");

const express = require('express');
const app = express();
const session = require('cookie-session');

// Middleware imports
const { limiter, auth } = require("./middleware");

// Router Imports
const authRouter = require("./routes/auth");
const customerRouter = require("./routes/customer")
const transactionRouter = require("./routes/transactions");
const accountRouter = require("./routes/accounts");
const cardRouter = require("./routes/cards");
const paymentCron = require('./functions/scheduleCron');



app.use(express.json());
app.use(session({
  secret: process.env.SECRET,
  cookie: {
    maxAge: 10 * 60 * 100000,
  },
  saveUninitialized: true,
  resave: false
}))

app.get("/", (req, res) => {
  res.send("Welcome to the bank of David");
})

app.use('/auth', authRouter);
app.use('/api/v1', auth, limiter, customerRouter);
app.use('/api/v1/transactions', auth, limiter, transactionRouter);
app.use('/api/v1/account', auth, limiter, accountRouter);
app.use('/accounts/:accountId/cards', auth, limiter, cardRouter);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    })
    paymentCron();
  } catch (err) {
    console.log(err);
  }
}

start();