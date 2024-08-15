import { client } from "../db.js";

//agregar un nuevo paciente
const createPaciente = async (req, res) => {
    const { DNI, nombre, apellido,mail, FechaNacimiento } = req.body;

        const result = await client.query(
            `INSERT INTO public."Paciente" ("DNI-Paciente", "Nombre", "Apellido","Mail", "Fecha Nacimiento" ) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`, 
             [DNI, nombre, apellido,mail, FechaNacimiento ]
        );

        res.json("se creo correctamente el paciente");
} ;

// Ver perfil de un paciente
const verPerfilPaciente = async (req, res) => {
    const { DNI } = req.params;
    const result = await client.query('SELECT * FROM public."Paciente" WHERE "DNI-Paciente" = $1', [DNI]);
        res.json(result)
};
//Eliminar perfil  de un  medico
const deletePaciente = async (req, res) => {
    const DNI = req.params;
    const result = await client.query(
        'DELETE FROM public."Paciente" WHERE "DNI-Paciente" = $1',
        [DNI]
    
    )
    res.json({ message: 'Paciente eliminado corrrectamente' });

};

const pacientes = {
        
    createPaciente,
    verPerfilPaciente,
    deletePaciente
  
 };
 export default pacientes;