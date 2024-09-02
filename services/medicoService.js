import { client } from "../db.js";

// Agregar un nuevo médico
const createMedico = async (DNI, nombre, apellido, mail, contraseña, matricula, hospital) => {
    const result = await client.query(
        `INSERT INTO public."Medico" ("DNI", "Nombre", "Apellido", "mail", "contraseña", "matricula", "Hospital") 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
        [DNI, nombre, apellido, mail, contraseña, matricula, hospital]
    );
    return result.rows[0];
};

//login del usuario
const loginMedico = async (mail, contraseña) => {
    const result = await client.query(
        'SELECT * FROM public."Medico" WHERE mail = $1', [mail]
    );
    return result.rows[0];
};

// Ver perfil de un médico
const verPerfilMedico = async (DNI) => {
    const medico = await client.query('SELECT * FROM public."Medico" WHERE "DNI" = $1', [DNI]);
    return medico.rows[0];
};

// Ver perfiles de todos los médicos
const verMedicos = async () => {
    const result = await client.query('SELECT * FROM public."Medico"');
    return result.rows;
};

// Cambiar información en el perfil del médico
const updateMedico = async (DNI, contraseña) => {
    const result = await client.query(
        'UPDATE public."Medico" SET "contraseña" = $1 WHERE "DNI" = $2 RETURNING *',
        [contraseña, DNI]
    );
    return result.rows[0];
};

// Eliminar perfil de un médico
const deleteMedico = async (DNI) => {
    await client.query('DELETE FROM public."Medico" WHERE "DNI" = $1', [DNI]);
    return { message: 'Médico eliminado correctamente' };
};

const servicemedico = {
    createMedico,
    verPerfilMedico,
    verMedicos,
    updateMedico,
    deleteMedico, 
}
export default servicemedico;