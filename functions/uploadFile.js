const { InternalServerError, BadRequestError } = require("../errors");
const cloudinary = require("./cloudinary.config")

/**
 * uploadImage
 * 
 * @param {string} path path to where image is stored locally.
 */
const uploadImage = async (path) => {
  const options = {
    use_filename: false,
    unique_filename: true,
    overwrite: false
  }
  try {
    const result = await cloudinary.uploader.upload(path, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
    throw new InternalServerError("Image could not be uploaded");
  }
}

const getAssetInfo = async (publicID) => {
  
  const options = {
    colors: true,
  };

  try {
    const result = await cloudinary.api.resource(publicID, options);
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Asset information could not be retrieved");
  }
}

module.exports = {
  uploadImage,
  getAssetInfo
}