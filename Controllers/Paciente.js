import { client } from "../db.js";
import medicos from "../Controllers/Medico.js";
import pacienteService from '../services/pacienteService.js';

// Agregar un nuevo paciente
const createPaciente = async (req, res) => {
    const { DNI, Nombre, Apellido, mail, FechaNacimiento, Medico } = req.body;
    //validaciones
    if (typeof DNI != 'string') throw new Error('DNI must be a string');
    if (DNI.length != 8) throw new Error('DNI debe contener 8 caracteres');
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(Nombre)) throw new Error('Nombre debe contener solo letras');
    if (Nombre.length > 50) throw new Error('Nombre no puede tener más de 50 caracteres');
    if (!nameRegex.test(Apellido)) throw new Error('Apellido debe contener solo letras');
    if (Apellido.length > 50) throw new Error('Apellido no puede tener más de 50 caracteres');  
    if (typeof mail != 'string') throw new Error('mail must be a string');
    if (mail.length < 3) throw new Error('mail debe tener más de tres caracteres');
    if (!mail.includes('@')) throw new Error('mail debe contener un @');
    if (mail.length > 100) throw new Error('mail no puede tener más de 100 caracteres');
    
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