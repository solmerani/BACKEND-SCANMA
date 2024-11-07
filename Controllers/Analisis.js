import cloudinary from "../middleweras/upload.js";
import analisisService from "../services/analisisService.js";
import fs from 'fs';
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
       
    //conexion con ia 

    try {
        const body = { url: imageUrl };
        const response = await fetch("https://project-malaria.onrender.com/analyze_image", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log(data);
        const prediccion = data.prediction;
        if (prediccion === "Infectado") {
            const resultado = true;
            try {
                await analisisService.updateResult(resultado,paciente);
                console.log('Resultado actualizado correctamente');
            } catch (error) {
                console.error('Error al actualizar resultado:', error);
                res.status(500).json({ message: "Error al actualizar resultado", error: error.message });
            }
        }
        else if (prediccion === "Sano") {
            const resultado = false;
            try {
                await analisisService.updateResult(resultado,paciente);
                console.log('Resultado actualizado correctamente');
            } catch (error) {
                console.error('Error al actualizar resultado:', error);
                res.status(500).json({ message: "Error al actualizar resultado", error: error.message });
            }
        }
        
        if (response.ok) {
            // Eliminar el archivo local después de subirlo y analizarlo
            fs.unlink(image, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo local:', err);
                } else {
                    console.log('Archivo local eliminado correctamente');
                }
            });

            return res.json({ message: "Análisis subido correctamente", imageUrl });
        } else {
            console.error('Error en la respuesta de análisis:', data.message);
            return res.status(500).json({ message: "Error al subir análisis" });
        }
    } catch (err) {
        console.error('Error al conectar con la IA:', err);
        return res.status(500).json({ message: "Error al conectar con la IA", error: err.message });
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