import axios  from 'axios';
const FormData = require('form-data');
const render = 'quintoproyecto.onrender.com'; 


const sendImageToIA = async (imageUrl) => {
  try {
      // Crear un FormData si la API requiere datos adicionales o en un formato específico
      const formData = new FormData();
      formData.append('image', imageUrl); // Enviar la URL de la imagen de Cloudinary
      const response = await axios.post(`http://${render}`, formData, {
        headers: {
            ...formData.getHeaders()
        }
    });

    return response.data;  // Devolver los datos de la respuesta de la IA
} catch (error) {
    console.error('Error enviando imagen a la IA:', error.message);
    throw error;
}
};

export default sendImageToIA;