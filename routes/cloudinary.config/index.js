import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const config = {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

Object.entries(config).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`${key} is not defined`);
  }
});

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: true,
});

// Function to upload image 
const uploadImage = async (file) => {
  if (!file?.path) {
    throw new Error("Invalid file parameter");
  }

  try {
    const { secure_url: secureUrl } = await cloudinary.uploader.upload(file.path);
    if (!secureUrl) {
      throw new Error("Error uploading image to Cloudinary");
    }

    return secureUrl;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Error uploading image to Cloudinary");
  }
};

export { uploadImage };
