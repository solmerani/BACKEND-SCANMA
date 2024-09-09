
import express from 'express';

import  multer from 'multer';
const router = express.Router();

// Configura Multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para subir la imagen



export default router;