require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const { check } = require('../functions');


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
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"]
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email"
    ],
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true
  },
  accounts: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "account"
    }]
  },
  acceptTerms: {
    type: Boolean,
    required: true
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 8
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
      "Please provide valid phone number ({country code}{number} or +{country code}{number})"
    ],
    validate: {
      validator: function(value) {
        return check(value);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  bvn: {
    type: String,
    required: true,
    unique: true,
    max_length: 11
  },
  postalCode: {
    type: Number,
    required: true
  },
  reset_token: {
    token: String,
    expires: Date,
  }
}, {
  timestamps: true
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

CustomerSchema.set(
  'toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.password;
    }
  }
)

module.exports = mongoose.model('user', UserSchema);