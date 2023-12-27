const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const CardSchema = new mongoose.Schema({
  accountId: {
    type: String,
    desc: {
      type: mongoose.Types.ObjectId,
      ref: 'account'
    },
    unique: true
  },
  cardNumber: {
    type: String,
    required: true,
    match: [
      /(^4[0-9]{12}(?:[0-9]{3})?$)|(^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$)|(3[47][0-9]{13})|(^3(?:0[0-5]|[68][0-9])[0-9]{11}$)|(^6(?:011|5[0-9]{2})[0-9]{12}$)|(^(?:2131|1800|35\d{3})\d{11}$)/,
      "Please provide valid card number"
    ],
    unique: true
  },
  displayString: {
    type: String,
    required: true,
    default: function() {
      let number = this.cardNumber.toString();
      let display = number.slice(-4);
      return `XXXX-XXXX-XXXX-${display}`;
    }
  },
  cardProvider: {
    type: String,
    enum: ['MasterCard', 'Verve', 'Visa']
  },
  date: {
    type: String,
    required: true,
  },
  cvv: {
    type: String,
    required: true,
    maxlength: 3
  }
});

CardSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt();
  this.cardNumber = bcrypt.hash(this.cardNumber, salt);
  this.cvv = bcrypt.hash(this.cvv, salt);
});

CardSchema.methods.compareValues = function (cardNumber, cvv) {
  try {
    const numberMatch = bcrypt.compare(cardNumber, this.cardNumber);
    const cvvMatch = bcrypt.compare(cvv, this.cvv);

    if (numberMatch && cvvMatch) {
      return true;
    }
    return false;
  } catch (err) {
    throw new err;
  }
}

module.exports = mongoose.model('card', CardSchema);
exports.CardSchema = CardSchema;