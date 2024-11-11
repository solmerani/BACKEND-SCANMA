import cloudinary from "../middleweras/upload.js";
import analisisService from "../services/analisisService.js";
import fs from 'fs';
import upload from '../middleweras/multer.js';
import fetch from 'node-fetch';

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
    const { paciente, notas } = req.body;
    const medicoDni = req.userDNI;
    const fecha = Date.now();

    // Validación para campos requeridos
    if (!image) {
        return res.status(400).json({ message: 'Es necesario subir una imagen.' });
    }
    if (!paciente) {
        return res.status(400).json({ message: 'Estos campos son requeridos' });
    }

    try {
        // Subir imagen a Cloudinary
        const uploadImage = await cloudinary.uploader.upload(image, { folder: 'analisis' });
        const imageUrl = uploadImage.secure_url;

        console.log('Imagen subida a Cloudinary:', imageUrl);

        // Guardar análisis en la base de datos
        await analisisService.SaveAnalisis(imageUrl, fecha, paciente, medicoDni, notas);

        // Enviar respuesta inicial al cliente
        res.status(200).json({
            message: 'Imagen subida y URL guardada correctamente',
            imageUrl: imageUrl
        });

        // Realizar llamada a la IA
        const body = { url: imageUrl };
        const response = await fetch("https://scama.onrender.com/analyze_image/", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Respuesta de la IA:', data);

            const prediccion = data.prediction;
            const resultado = (prediccion === "Anomalía");

            try {
                await analisisService.updateResult(resultado, paciente);
                console.log('Resultado actualizado correctamente');
            } catch (error) {
                console.error('Error al actualizar resultado:', error);
            }

            // Eliminar archivo local
            fs.unlink(image, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo local:', err);
                } else {
                    console.log('Archivo local eliminado correctamente');
                }
            });
            return res.status(200).json({
                message: 'Imagen subida y análisis completado',
                imageUrl: imageUrl,
                resultadoIA: prediccion
            });
        } else {
            console.error('Error en la respuesta de análisis:', data.message);
        }
       

    } catch (error) {
        console.error('Error al procesar el análisis:', error);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Error al procesar el análisis", error: error.message });
        }
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




const Analisis = {
    manejarSubidaArchivo,
    SaveAnalisis,
    getAnalisisbyPaciente,
    getAllAnalisis
   
}

export default Analisis;