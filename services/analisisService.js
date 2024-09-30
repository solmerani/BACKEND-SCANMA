import {client} from  '../db.js';

const SaveAnalisis = async (image, fecha, paciente, medico) => {
    try {
        const fechaValida = new Date(parseInt(fecha)).toISOString();
        await client.query(
            'INSERT INTO public."Analisis" ("Imagen","Fecha", "Paciente","Medico") VALUES ($1, $2, $3, $4)',
            [image, fechaValida, paciente, medico],
        );
    } catch (error) {
        console.error('Error saving URL to database:', error);
        throw error;
    }
};

const getAnalisisbyPaciente = async (DNI) => {
    
       const result= await client.query(
            'GET * FROM public."Analisis" WHERE "Paciente" = $1'[DNI],
        );
        return result.rows;
   
};

const updateResult = async (resultado,DNI)  => {
const result = await client.query(
    'UPDATE public."Medico" SET "Resultado" = $1 WHERE "Paciente" = $2 RETURNING * '[resultado,DNI]
)

};
const serviceAnalisis = {
SaveAnalisis,
getAnalisisbyPaciente,
updateResult

}

export default serviceAnalisis;