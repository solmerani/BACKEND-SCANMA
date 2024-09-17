import {client} from  '../db.js';

import {v2 as cloudinary} from 'cloudinary';
dotenv.config();

//configuracion de cloudinary
cloudinary.config ({
    cloud_name:process.env.APP_CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.APP_CLOUDINARY_API_KEY,
    api_secret: process.env.APP_CLOUDINARY_SECRET_KEY,
});

const uploadToCloudinary = async (imagePath) => {
    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            resource_type: 'auto',
            folder: 'mamografias' // Puedes ajustar la carpeta si es necesario
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

const SaveUrlDB = async (url, analysisId) => {
    try {
        await client.query(
            'UPDATE public."Analisis" SET "imagen" = $1 WHERE "id" = $2',
            [url, analysisId]
        );
    } catch (error) {
        console.error('Error saving URL to database:', error);
        throw error;
    }
};

const serviceAnalisis = {
SaveUrlDB,
uploadToCloudinary
}

export default serviceAnalisis;