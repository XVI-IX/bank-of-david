require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');


const CustomerSchema = new mongoose.Schema({
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
  address: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: function() {
      return (new Date().getFullYear() - this.dob.getFullYear());
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
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  modifiedAt: {
    type: Date,
    default: new Date()
  },
  userName: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return `${this.firstName} ${this.lastName}`;
    }
  },
  phoneNumber: {
    type: String,
    unique: true,
    match: [
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
      "Please provide valid phone number"
    ]
  },
  bvn: {
    type: String,
    required: true,
    unique: true
  },
  postalCode: {
    type: Number,
    required: true
  }
});

CustomerSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.bvn = await bcrypt.hash(this.bvn, salt);
});

CustomerSchema.pre('save', async function() {
  this.dob = this.dob.getDate();
});

CustomerSchema.methods.createJWT = function () {
  return jwt.sign({
    userId: this._id,
    userName: this.userName,
  }, 
  process.env.SECRET,
  {
    expiresIn: process.env.SPAN
  });
}

CustomerSchema.methods.comparePassword = async function (reqPassword) {
  try {
    const match = await bcrypt.compare(reqPassword, this.password);
    return match;
  } catch (error) {
    throw new UnauthenticatedError("Please provide valid password");
  }
}

module.exports = mongoose.model('customer', CustomerSchema);