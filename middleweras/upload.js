import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config ({
    cloud_name:process.env.APP_CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.APP_CLOUDINARY_API_KEY,
    api_secret: process.env.APP_CLOUDINARY_SECRET_KEY,
    secure: true,
});
export default cloudinary;
