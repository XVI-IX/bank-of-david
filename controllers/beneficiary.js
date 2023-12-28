require("dotenv").config();

const { Beneficiary } = require("../models");
const { StatusCodes } = require("http-status-codes");
const {
  NotFoundError, InternalServerError
} = require("../errors");

const { addBeneficiarySchema, updateBeneficiarySchema } = require("./schema");

const addBeneficiary = async (req, res) => {
  try {
    const {
      fullName, accountNumber,
      bankName, bankBranch,
      country, currency,
      notes
    } = req.body;

    await addBeneficiarySchema.validateAsync({
      fullName: fullName,
      accountNumber: accountNumber,
      bankName: bankName,
      bankBranch: bankBranch,
      country: country,
      currency: currency,
      notes: notes
    });

    const beneficiary = new Beneficiary({
      fullName: fullName,
      accountNumber: accountNumber,
      bankName: bankName,
      bankBranch: bankBranch,
      country: country,
      currency: currency,
      notes: notes
    });

    await beneficiary.save();

    return res.status(StatusCodes.OK).json({
      message: "Beneficiary added successfully",
      status: "success",
      statusCode: StatusCodes.OK,
      data: beneficiary
    })
  } catch (error) {
    console.error(error);
    throw new InternalServerError("Beneficiary could not be created.")
  }
}

const getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find();

    if (!beneficiaries || beneficiaries.length === 0) {
      throw new NotFoundError("Beneficiaries could not found.");
    }

    return res.status(StatusCodes.OK).json({
      message: "Beneficiaries retrieved successfully",
      status: "success",
      statusCode: StatusCodes.OK,
      data: beneficiaries
    })
  } catch (error) {
    console.error(error);

    if (error instanceof NotFoundError || error.name === "CastError") {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: error.message,
        status: "error",
        statusCode: StatusCodes.NOT_FOUND,
        data: null
      })
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: "error",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      data: null
    })
  }
}

const getBeneficiary = async (req, res) => {
  try {
    const { beneficiaryId } = req.params;
    const beneficiary = await Beneficiary.findById(beneficiaryId);

    if (!beneficiary) {
      throw new NotFoundError("Beneficiary not found.");
    }

    return res.status(StatusCodes.OK).json({
      message: "Beneficiary retrieved successfully",
      status: "success",
      statusCode: StatusCodes.OK,
      data: beneficiary
    });
  } catch (error) {
    console.error(error);

    if (error instanceof NotFoundError || error.name === "CastError") {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: error.message,
        status: "error",
        statusCode: StatusCodes.NOT_FOUND,
        data: null
      })
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: "error",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      data: null
    });
  }
}

const updateBeneficiary = async (req, res) => {
  try {
    const { beneficiaryId } = req.params;
    const {
      fullName, accountNumber,
      bankName, bankBranch,
      country, currency,
      notes
    } = req.body;

    await updateBeneficiarySchema.validateAsync({
      fullName: fullName,
      accountNumber: accountNumber,
      bankName: bankName,
      bankBranch: bankBranch,
      country: country,
      currency: currency,
      notes: notes
    });

    const beneficiary = await Beneficiary.findByIdAndUpdate(
      beneficiaryId, {
          fullName: fullName,
          accountNumber: accountNumber,
          bankName: bankName,
          bankBranch: bankBranch,
          country: country,
          currency: currency,
          notes: notes
      }, {
        new: true
      }
    );

    return res.status(StatusCodes.OK).json({
      message: "Beneficiary updated successfully",
      status: "success",
      statusCode: StatusCodes.OK,
      data: beneficiary
    })
  } catch (error) {
    console.error(error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: "error",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      data: null
    })
  }
}

const deleteBeneficiary = async (req, res) => {
  try {
    const { beneficiaryId } = req.params;
    const beneficiary = await Beneficiary.findById(beneficiaryId);

    if (!beneficiary) {
      throw new NotFoundError("Beneficiary not Found.")
    }

    await Beneficiary.findByIdAndDelete(beneficiaryId);

    return res.status(StatusCodes.OK).json({
      message: "Beneficiary deleted",
      status: "success",
      statusCode: StatusCodes.OK,
      data: null
    })
  } catch (error) {
    console.error(error);

    if (error instanceof NotFoundError) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: error.message,
        status: "error",
        statusCode: StatusCodes.NOT_FOUND,
        data: null
      })
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: "error",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      data: null
    })
  }
}

module.exports = {
  addBeneficiary,
  getBeneficiaries,
  getBeneficiary,
  updateBeneficiary,
  deleteBeneficiary
}