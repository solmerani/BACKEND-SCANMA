import { client } from "../db.js";

//agregar un nuevo medico
const createMedico = async (req, res) => {
    const { DNI, nombre, apellido, mail, contraseña, matricula, hospital } = req.body;

    const result = await client.query(
        `INSERT INTO public."Medico" ("DNI", "Nombre", "Apellido", "mail", "password", "matricula", "Hospital") 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
        [DNI, nombre, apellido, mail, contraseña, matricula, hospital]
    );

    res.json(result);
};

// Ver perfil de un médico
const verPerfilMedico = async (req, res) => {
    const { DNI } = req.params;
    const medico = await client.query('SELECT * FROM public."Medico" WHERE "DNI" = $1', [DNI]);
    res.json(medico)
};
//Eliminar perfil  de un  medico
const deleteMedico = async (req, res) => {
    const { DNI } = req.params;
    const result = await client.query(
        'DELETE FROM public."Medico" WHERE "DNI" = $1',
        [DNI]
    )
    res.json({ message: 'Médico eliminado corrrectamente' });

};


const medicos = {

    createMedico,
    deleteMedico,
    verPerfilMedico,
};

export default medicos;

// Completar con la consulta que crea una canción
