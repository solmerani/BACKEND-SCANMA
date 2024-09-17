
import express from 'express';
import Analisis  from '../Controllers/Analisis.js';


const routerA = express.Router();
const upload = Analisis.upload;

// Ruta para subir análisis
routerA.post('/upload', upload.single('image'), Analisis.uploadImageToCloudinary, Analisis.saveImageUrlToDB);


export default routerA;