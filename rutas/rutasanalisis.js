
import express from 'express';
import Analisis  from '../Controllers/Analisis.js';
import upload from '../middleweras/multer.js';
import verifyToken from '../middleweras/auth.js';
const routerA = express.Router();


// Ruta para subir análisis
routerA.post('/upload',verifyToken, upload.single('image'), Analisis.SaveAnalisis);
routerA.get('/:DNI', Analisis.getAnalisisbyPaciente);
routerA.put('/resultado', Analisis.updateResult);
routerA.get('/all', Analisis.getAllAnalisis);

export default routerA;