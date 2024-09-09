import { client } from "../db.js";

// Agregar un nuevo paciente
const createPaciente = async (DNI, Nombre, Apellido, mail, FechaNacimiento, Medico) => {
    const result = await client.query(
        `INSERT INTO public."Paciente" ("DNI-Paciente", "Nombre", "Apellido", "Mail", "Fecha Nacimiento", "Medico") 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
        [DNI, Nombre, Apellido, mail, FechaNacimiento, Medico]
    );
    return result.rows[0];
};
//verificar si el correo esta en usp
const verificarCorreo = async (mail) => {
    const result = await client.query( 
         'SELECT * FROM public."Paciente" WHERE "Mail" = $1', [mail]);
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

// ver todos los pacientes de un medico 
const verPacientesMedico = async (DNIMedico) => {
    const result = await client.query('SELECT * FROM public."Paciente" WHERE "Medico" = $1', [DNIMedico] );
    return result.rows;
};
// Eliminar perfil de un paciente
const deletePaciente = async (DNI) => {
    await client.query('DELETE FROM public."Paciente" WHERE "DNI-Paciente" = $1', [DNI]);
    return { message: 'Paciente eliminado correctamente' };
};

const servicePaciente = {
    createPaciente,
    verificarCorreo,
    verPerfilPaciente,
    verPacientes,
    verPacientesMedico,
    deletePaciente,
}
export default servicePaciente;