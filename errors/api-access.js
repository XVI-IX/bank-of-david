const { StatusCodes } = require("http-status-codes");
const CustomError = require("./custom");

class APIAccessError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCodes = StatusCodes.SERVICE_UNAVAILABLE;
  }
}

module.exports = APIAccessError;