import { client } from "../db.js";

import pacienteService from '../services/pacienteService.js';

// Agregar un nuevo paciente
const createPaciente = async (req, res) => {
    const { DNI, nombre, apellido, mail, FechaNacimiento } = req.body;
    // Validación del DNI
    if (typeof DNI != 'string') throw new Error('DNI must be a string');
    if (DNI.length != 8) throw new Error('DNI debe contener 8 caracteres');


    // Validacion de que todos los campos son obligatorios
    if (!DNI || !nombre || !apellido || !mail || !FechaNacimiento ) 
        throw new Error('Todos los campos son obligatorios');

    // Validacion nombre y apellido 
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(nombre)) throw new Error('Nombre debe contener solo letras');
    if (!nameRegex.test(apellido)) throw new Error('Apellido debe contener solo letras');
    if (nombre.length > 50) throw new Error('Nombre no puede tener más de 50 caracteres');
    if (apellido.length > 50) throw new Error('Apellido no puede tener más de 50 caracteres');

    // Validación del mail
    if (typeof mail != 'string') throw new Error('mail must be a string');
    if (mail.length < 3) throw new Error('mail debe tener más de tres caracteres');
    if (!mail.includes('@')) throw new Error('mail debe contener un @');
    if (mail.length > 100) throw new Error('mail no puede tener más de 100 caracteres');
    

    // Asegurarse de que el mail no esté en uso ya para la creación de usuario
    const user = await User.findOne({ mail });
    if (user) throw new Error('este mail ya está en uso');
    

    try {
        const paciente = await pacienteService.createPaciente(DNI, nombre, apellido, mail, FechaNacimiento);
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
    deletePaciente,
    verPacientes,
  
 };
 export default pacientes;