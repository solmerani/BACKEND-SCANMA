import { client } from "../db.js";
import analisisService from "../services/analisisService.js";
import cloudinary from '../../upload.js';

//extensiones de archivos

    const imageFile = req.file.path;
    const extension = imageFile.split('.').pop();
    const extensionesPermitidas = ['pdf', 'png', 'jpeg', 'jpg'];
    
    if (!extensionesPermitidas.includes(extension)) {
        console.error('Extensión de archivo no permitida');
        return res.status(400).send('Error: Extensión de archivo no permitida. Extensiones admitidas: PDF, PNG, JPEG, y JPG');
    }



//subir imagenes a cloudinary

const AnalisisUrl = async (req,res) => {
    try {
        const image = req.file;
        if (!image) {
            res.status(400).send("no se encontro ninguna imagen");
        }
    //subir imagen a cloudinary
    const imageFile = req.file.path;

    const result = await cloudinary.uploader.upload(imageFile, {
        folder: 'analisis',
    });
    
    const imageUrl = result.secure_url;

    res.status(200).json({
        message: 'imagen subida correctamente',
        imageurl: result.secure_url
    });
    } catch (error){
        console.error('Error al subir imagen:', error);
        res.status(500).json({ message: 'Error al subir imagen' });
    }

};
// Función para guardar la URL en la base de datos
const SaveUrlDB = async (req, res) => {
    try {
        const { analysisId } = req.params;
        const { imageUrl, imagePath } = req;

        // Guardar la URL en la base de datos
        await analisisService.SaveUrlDB(imageUrl, analysisId);

        // Eliminar la imagen de la carpeta temporal
        fs.unlinkSync(imagePath);

        res.status(200).json({
            message: 'Imagen subida y URL guardada correctamente',
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error('Error al guardar la URL en la base de datos:', error);
        res.status(500).json({ message: 'Error al guardar la URL en la base de datos' });
    }
};





const Analisis = {
    AnalisisUrl,
    SaveUrlDB,
   
}

export default Analisis;