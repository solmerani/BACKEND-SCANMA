import {client} from  '../db.js';

const SaveAnalisis = async (image, fecha, paciente, medico) => {
    try {
        await client.query(
            'INSERT INTO public.Analisis (Imagen, Fecha, Paciente, Medico) VALUES ($1, $2, $3, $4)',
            [image, fecha, paciente, medico],
        );
    } catch (error) {
        console.error('Error saving URL to database:', error);
        throw error;
    }
};

const serviceAnalisis = {
SaveAnalisis,

}

export default serviceAnalisis;