import { client } from "../db.js";
import bcrypt from "bcryptjs";

// Agregar un nuevo médico
const createMedico = async (DNI, nombre, apellido, mail, hashedPassword, matricula, hospital) => {
    const result = await client.query(
        `INSERT INTO public."Medico" ("DNI", "Nombre", "Apellido", "mail", "contraseña", "matricula", "Hospital") 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
        [DNI, nombre, apellido, mail, hashedPassword, matricula, hospital]
    );
    return result.rows[0];
};

//verificar si el correo esta en usp
const verificarCorreo = async (mail) => {
    const result = await client.query( 
         'SELECT * FROM public."Medico" WHERE mail = $1', [mail]);
         return result.rows[0];
};


//login del usuario
const loginMedico = async (mail, contraseña) => {
    // Usando la consulta SQL directamente
    const result = await client.query(
        'SELECT * FROM public."Medico" WHERE mail = $1', [mail]
    );
    const medico = result.rows[0];

    if (medico) {
        // Comprobar si la contraseña es válida
        const isValid = bcrypt.compareSync(contraseña, medico.contraseña);
        if (isValid) {
            return medico;
        } else {
            throw new Error('Contraseña incorrecta');
        }
    } else {
        throw new Error('Usuario no existe');
    }
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


// Cambiar contraseña
const cambiarContraseña = async (DNI, hashedPassword) => {
    const result = await client.query(
        'UPDATE public."Medico" SET "contraseña" = $1 WHERE "DNI" = $2 RETURNING *',
        [hashedPassword, DNI]
    );
    return result.rows[0];
};
       

// Eliminar perfil de un médico
const deleteMedico = async (DNI) => {
    await client.query('DELETE FROM public."Medico" WHERE "DNI" = $1', [DNI]);
    return { message: 'Médico eliminado correctamente' };
};

const servicemedico = {
    loginMedico,
    createMedico,
    verificarCorreo,
    verPerfilMedico,
    verMedicos,
    cambiarContraseña,
    deleteMedico, 
}
export default servicemedico;