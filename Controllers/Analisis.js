import cloudinary from "../middleweras/upload.js";
import { client } from "../db.js";
import analisisService from "../services/analisisService.js";
import upload from '../middleweras/multer.js';

//extensiones de archivos

const manejarSubidaArchivo = (req, res) => {
    const imageFile = req.file.path;
    const extension = imageFile.split('.').pop();
    const extensionesPermitidas = ['pdf', 'png', 'jpeg', 'jpg'];
    
    if (!extensionesPermitidas.includes(extension)) {
        console.error('Extensión de archivo no permitida');
        return res.status(400).send('Error: Extensión de archivo no permitida. Extensiones admitidas: PDF, PNG, JPEG, y JPG');
    }
}



//subir imagenes a cloudinary
    const SaveAnalisis = async (req, res) => {
        
        const image = req.file.path;
        const { paciente, medico } = req.body;
        const fecha = Date.now()
        try {
            const uploadImage = await cloudinary.uploader.upload(image, {
                folder: 'analisis',
            });
    
            const imageUrl = uploadImage.secure_url;
    
            console.log(imageUrl);
            await analisisService.SaveAnalisis(imageUrl, fecha, paciente, medico);
            res.status(200).json({
                message: 'Imagen subida y URL guardada correctamente',
                imageUrl: imageUrl
            });
        }catch (error){
            console.error('Error al subir imagen:', error);
            res.status(500).json({ message: 'Error al subir imagen' });
        }
       
    
};


const getAnalisisbyID = async (req,res) => {
    try{
 const id = req.params.id;
 const analisis = await analisisService.getAnalisisbyID(id);
 if (analisis){
    
 }
    }catch(error){

    }
}


const Analisis = {
    manejarSubidaArchivo,
    SaveAnalisis,
    getAnalisisbyID,
   
}

export default Analisis;