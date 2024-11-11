import {pool} from  '../db.js';


const SaveAnalisis = async (image, fecha, paciente, medico,) => {
    try {
        const fechaValida = new Date(parseInt(fecha)).toISOString();
        await pool.query(
            'INSERT INTO public."Analisis" ("Imagen","Fecha", "Paciente","Medico","Resultado","notas") VALUES ($1, $2, $3, $4,$5,$6)',
            [image, fechaValida, paciente, medico,false,false],
        );
    } catch (error) {
        console.error('Error saving URL to database:', error);
        throw error;
    }
};

const getAnalisisbyPaciente = async (DNI) => {
    
       const result= await pool.query(
            'SELECT * FROM public."Analisis" WHERE "Paciente" = $1',[DNI],
        );
        return result.rows;
   
};
const getAllAnalisis = async () => {
    const result = await pool.query('SELECT * FROM public."Analisis"');
return result.rows;
};


const updateResult = async (resultado,paciente)  => {
const result = await pool.query(
    'UPDATE public."Analisis" SET "Resultado" = $1 WHERE "Paciente" = $2 ',[resultado,paciente],
);
return result.rows;

};
const serviceAnalisis = {
SaveAnalisis,
getAnalisisbyPaciente,
updateResult,
getAllAnalisis

}

export default serviceAnalisis;