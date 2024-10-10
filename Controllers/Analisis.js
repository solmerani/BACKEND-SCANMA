import cloudinary from "../middleweras/upload.js";
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
        const { paciente,notas } = req.body;
        const medicoDni = req.userDNI;
        const fecha = Date.now()
        // Validación para campos requeridos
    if (!image ) {
        return res.status(400).json({
            message: ' Es necesario subir una imagen.'
        });
    }
    if (!paciente) {
        return res.status(400).json({
            message: ' Estos campos son requeridos'
        });
    }
  

        try {
            const uploadImage = await cloudinary.uploader.upload(image, {
                folder: 'analisis',
            });
   
            const imageUrl = uploadImage.secure_url;
    
            console.log(imageUrl);
            await analisisService.SaveAnalisis(imageUrl, fecha, paciente,medicoDni,notas);
            res.status(200).json({
                message: 'Imagen subida y URL guardada correctamente',
                imageUrl: imageUrl
            });
           
        }catch (error){
         console.log(error);
            console.error('Error al subir imagen:', error);
            res.status(500).json({  message: 'Internal Server Error', error: error.message  });
        }
       
    
};


const getAnalisisbyPaciente = async (req,res) => {
    const {DNI} = req.params;
    console.log('DNI recibido:', DNI);
    try{
 const analisis = await analisisService.getAnalisisbyPaciente(DNI);
 if (analisis) {
    res.json(analisis);
} else {
    res.status(404).json({ error: 'Analisis no encontrado' });
}

 }catch(error){
    res.status(500).json({ error: 'Error al obtener los analisis del paciente' });
    }
};
const getAllAnalisis = async (req,res)=> {
    try {
        const result = await analisisService.getAllAnalisis();
    res.json(result);
    }catch(error){
        res.status(500).json({ error: 'Error al obtener los analisis ' });
    }

}

const updateResult = async (req,res) => {
    const {resultado,DNI} = req.body;
    try{
    const result = await analisisService.updateResult(resultado,DNI);
    if (result) {
        console.log(resultado);
        res.status(200).json({ message: 'Resultado actualizado correctamente' });
    } else {
        res.status(404).json({ error: 'Análisis no encontrado' });
    }
} catch (error) {
    console.error('Error al actualizar el resultado:', error);
    res.status(500).json({ error: 'Error al actualizar el resultado' });
}
};


const Analisis = {
    manejarSubidaArchivo,
    SaveAnalisis,
    getAnalisisbyPaciente,
    updateResult,
    getAllAnalisis
   
}

export default Analisis;