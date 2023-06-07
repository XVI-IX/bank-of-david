const UnauthenticatedError = require('../errors');

const sessionExpired = (req) => {
  if (!req.session.customerId) {
    throw new UnauthenticatedError("Session Expired");
  }
}


module.exports = sessionExpired;