import { client } from "../db.js";

// Agregar un nuevo paciente
const createPaciente = async (DNI, nombre, apellido, mail, FechaNacimiento) => {
    const result = await client.query(
        `INSERT INTO public."Paciente" ("DNI-Paciente", "Nombre", "Apellido", "Mail", "Fecha Nacimiento") 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
        [DNI, nombre, apellido, mail, FechaNacimiento]
    );
    return result.rows[0];
};

// Ver perfil de un paciente
const verPerfilPaciente = async (DNI) => {
    const result = await client.query('SELECT * FROM public."Paciente" WHERE "DNI-Paciente" = $1', [DNI]);
    return result.rows[0];
};

// Ver todos los pacientes
const verPacientes = async () => {
    const result = await client.query('SELECT * FROM public."Paciente"');
    return result.rows;
};

// Eliminar perfil de un paciente
const deletePaciente = async (DNI) => {
    await client.query('DELETE FROM public."Paciente" WHERE "DNI-Paciente" = $1', [DNI]);
    return { message: 'Paciente eliminado correctamente' };
};

const servicePaciente = {
    createPaciente,
    verPerfilPaciente,
    verPacientes,
    deletePaciente,
}
export default servicePaciente;