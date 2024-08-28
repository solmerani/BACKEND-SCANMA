import { client } from "../db.js";

import pacienteService from '../services/pacienteService.js';

// Agregar un nuevo paciente
const createPaciente = async (req, res) => {
    const { DNI, nombre, apellido, mail, FechaNacimiento } = req.body;
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