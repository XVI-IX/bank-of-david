const UnauthenticatedError = require('../errors');

const sessionExpired = () => {
  if (!req.session.customerId) {
    throw new UnauthenticatedError("Session Expired");
  }
}


module.exports = sessionExpired;