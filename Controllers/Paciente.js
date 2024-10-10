
import medicos from "../Controllers/Medico.js";
import pacienteService from '../services/pacienteService.js';

// Agregar un nuevo paciente
const createPaciente = async (req, res) => {
    const { DNI, Nombre, Apellido, mail, FechaNacimiento,  } = req.body;
    //validaciones
    if (typeof DNI != 'string'){
        return res.status(400).json({ error: 'DNI must be a string' });}
    if (DNI.length != 8) {
        return res.status(400).json({ error: 'DNI debe contener 8 carcateres' });}
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(Nombre)) {
        return res.status(400).json({ error: 'el nombre debe contener solo letras' });
    }
    if (Nombre.length > 50) {
        return res.status(400).json({ error: 'el nombre no puede tener mas de 50 caracteres' });
    }
    if (!nameRegex.test(Apellido)) {
        return res.status(400).json({ error: 'el apellido debe contener solo letras' });
    }
    if (Apellido.length > 50) {
        return res.status(400).json({ error: 'el Apellido no puede tener mas de 50 caracteres' });
    }
    if (mail.length < 3) {
        return res.status(400).json({ error: 'el mail debe tener mas de 3 caracteres' });
    }
    if (!mail.includes('@')) {
        return res.status(400).json({ error: 'el mail debe contener un @' });
    }
    if (mail.length > 100) {
        return res.status(400).json({ error: 'el mail no puede tener mas de 100 caracteres ' });
    };
    
     // validacion de si el correo esta en uso
     const CorreoEnUso = await pacienteService.verificarCorreo(mail);
     if (CorreoEnUso) {
         return res.status(400).json({error:"el mail ya esta en uso"})
     }
    try {
        const paciente = await pacienteService.createPaciente(DNI, Nombre, Apellido, mail, FechaNacimiento, Medico);
        res.status(201).json(paciente);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el paciente' });
    }
};

// Ver perfil de un paciente
const verPerfilPaciente = async (req, res) => {
    const { DNI } = req.params;
    try {
        const paciente = await pacienteService.verPerfilPaciente(DNI);
        if (paciente) {
            res.json(paciente);
        } else {
            res.status(404).json({ error: 'Paciente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el perfil del paciente' });
    }
};

// Ver todos los pacientes
const verPacientes = async (req, res) => {
    try {
        const pacientes = await pacienteService.verPacientes();
        res.json(pacientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pacientes' });
    }
};

//ver todos los pacientes de un medico
const verPacientesMedico = async (req, res) => {
    const { DNIMedico} = req.params;
    try {
        const pacientes = await pacienteService.verPacientesMedico(DNIMedico);
        res.json(pacientes);
    } catch (error) {
        res.status(500).json ({ error: 'error al obtener los pacientes del medico'})
    }
}

// Eliminar perfil de un paciente
const deletePaciente = async (req, res) => {
    const { DNI } = req.params;
    try {
        const result = await pacienteService.deletePaciente(DNI);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el paciente' });
    }
};

const pacientes = {
        
    createPaciente,
    verPerfilPaciente,
    verPacientes,
    verPacientesMedico,
    deletePaciente,
   
  
 };
 export default pacientes;