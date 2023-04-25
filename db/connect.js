const mongoose = require('mongoose');

const connectDB = (uri) => {
  mongoose.connect(
    uri, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    }
  )
}

module.exports = connectDB;