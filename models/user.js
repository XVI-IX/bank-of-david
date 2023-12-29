require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const { check } = require('../functions');
const AccountSchema = require('./accounts');

const idSchema = new mongoose.Schema({
  /**
   * Document type
   */
  idDocument: {
    type: String,
    default: "NIN",
    required: true,
    enum: ["Driver's License", "Passport", "NIN"]
  },
  /**
   * reference to image of document
   */
  idImage: {
    type: String,
    required: true,
  },
  /**
   * check if document has been verified
   */
  verified: {
    type: Boolean,
    required: true,
    default: false
  }
});

const addressSchema = new mongoose.Schema({
  /**
   * First line of address
   */
  addressLine1: {
    type: String,
    required: true
  },
  /**
   * Second line of address
   */
  addressLine2: {
    type: String,
  },
  /**
   * city of address
   */
  city: {
    type: String,
    required: true
  },
  /**
   * State of address
   */
  state: {
    type: String,
    required: true
  },
  /**
   * Country of address
   */
  country: {
    type: String,
    required: true
  }
});

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
    type: addressSchema,
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
  account: {
    type: AccountSchema
  },
  idDocs: {
    type: [idSchema]
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
  reset_token: {
    token: String,
    expires: Date,
  },
  verified: {
    type: Boolean,
    default: false,
    rquired: true
  }
}, {
  timestamps: true
});

UserSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.bvn = await bcrypt.hash(this.bvn, salt);
});

UserSchema.pre('save', async function() {
  this.dob = this.dob.getDate();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({
    userId: this._id,
    userName: this.userName,
  }, 
  process.env.SECRET,
  {
    expiresIn: process.env.SPAN
  });
}

UserSchema.methods.comparePassword = async function (reqPassword) {
  try {
    const match = await bcrypt.compare(reqPassword, this.password);
    return match;
  } catch (error) {
    throw new UnauthenticatedError("Please provide valid password");
  }
}

UserSchema.set(
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