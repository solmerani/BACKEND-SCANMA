import { pool } from "../db.js";
import bcrypt from "bcryptjs";

// Agregar un nuevo médico
const createMedico = async (DNI, nombre, apellido, mail, hashedPassword, matricula, hospital) => {
    const result = await pool.query(
        `INSERT INTO public."Medico" ("DNI", "Nombre", "Apellido", "mail", "contraseña", "matricula", "Hospital","resetToken","resetTokenExpires") 
             VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9) 
             RETURNING *`,
        [DNI, nombre, apellido, mail, hashedPassword, matricula, hospital,null,null]
    );
    return result.rows[0];
};

//verificar si el correo esta en usp
const verificarCorreo = async (mail) => {
    const result = await pool.query( 
         'SELECT * FROM public."Medico" WHERE mail = $1', [mail]);
         return result.rows[0];
};


//login del usuario
const loginMedico = async (mail)=> {
   

    try {
        const { rows } = await pool.query(
            'SELECT * FROM public."Medico" WHERE mail = $1', [mail]
        );
        if (rows.length < 1) return null;

       
        return rows[0];
    } catch (error) {
       
        throw error;
    }// Usando la consulta SQL directamente
    
};


// Ver perfil de un médico
const verPerfilMedico = async (DNI) => {
    const medico = await pool.query('SELECT * FROM public."Medico" WHERE "DNI" = $1', [DNI]);
    return medico.rows[0];
};



// Ver perfiles de todos los médicos
const verMedicos = async () => {
    const result = await pool.query('SELECT * FROM public."Medico"');
    return result.rows;
};
const verificarToken = async (token) => {
    const result = await db.query(
        `SELECT * FROM public."Medico" WHERE "resetToken" = ? AND "resetTokenExpires" > NOW()`,
        [token]
    );
    return result[0]; // Retorna el usuario si el token es válido y no ha expirado
};

const GuardarToken = async (token, DNI) => {
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + 1); // Expira en 1 hora
    const result = await pool.query(
        `UPDATE public."Medico" SET "resetToken" = $1, "resetTokenExpires" = $2 WHERE "DNI" = $3`,
        [token, expiracion, DNI]
    );
    return result.rows[0];
};

// Cambiar contraseña
const cambiarContraseña = async (DNI, hashedPassword) => {
    const result = await pool.query(
        'UPDATE public."Medico" SET "contraseña" = $1 WHERE "DNI" = $2 RETURNING *',
        [hashedPassword, DNI]
    );
    return result.rows[0];
};
       

// Eliminar perfil de un médico
const deleteMedico = async (DNI) => {
    await pool.query('DELETE FROM public."Medico" WHERE "DNI" = $1', [DNI]);
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
    GuardarToken,
    verificarToken
}
export default servicemedico;