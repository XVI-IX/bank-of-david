require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');


const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please include first name"],
    minlength: 3
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String,
    required: [true, "Please add last name"],
    minlength: 3
  },
  dob: {
    type: Date,
    required: [true, "Please provide your date of birth"]
  },
  age: {
    type: Number,
    default: function() {
      return Date().getFullYear() - this.dob.getFullYear();
    }
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email"
    ],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 8
  }
});

UserSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt();
  this.password = bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({
    userId: this._id,
    userName: `${this.firstName} ${this.lastName}`
  }, process.env.SECRET, {
    expiresIn: process.env.SPAN
  })
}

UserSchema.methods.comparePassword = async function (reqPassword) {
  try {
    const match = await bcrypt.compare(reqPassword, this.password);
    return match;
  } catch (error) {
    throw new UnauthenticatedError("Please provide valid password");
  }
}

module.exports = mongoose.model('users', UserSchema);