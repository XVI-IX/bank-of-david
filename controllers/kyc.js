const { KYC } = require("../models");
const { StatusCodes } = require("http-status-codes");

const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
  } catch (error) {
    console.error(error);

  }
}

module.exports = {
  uploadDocument
}