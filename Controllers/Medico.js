import { client } from "../db.js";

import medicoService from '../services/medicoService.js';

// Agregar un nuevo médico
const createMedico = async (req, res) => {
    const { DNI, nombre, apellido, mail, contraseña, matricula, hospital } = req.body;
    
        const medico = await medicoService.createMedico(DNI, nombre, apellido, mail, contraseña, matricula, hospital);
        res.status(201).json(medico);
    
};

// Ver perfil de un médico
const verPerfilMedico = async (req, res) => {
    const { DNI } = req.params;
    try {
        const medico = await medicoService.verPerfilMedico(DNI);
        if (medico) {
            res.json(medico);
        } else {
            res.status(404).json({ error: 'Médico no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el perfil del médico' });
    }
};

// Ver perfiles de todos los médicos
const verMedicos = async (req, res) => {
    try {
        const medicos = await medicoService.verMedicos();
        res.json(medicos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los médicos' });
    }
};

// Cambiar información en el perfil del médico
const updateMedico = async (req, res) => {
    const { DNI, contraseña } = req.body;
    try {
        const medico = await medicoService.updateMedico(DNI, contraseña);
        if (medico) {
            res.json(medico);
        } else {
            res.status(404).json({ error: 'Médico no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el perfil del médico' });
    }
};

// Eliminar perfil de un médico
const deleteMedico = async (req, res) => {
    const { DNI } = req.params;
    try {
        const result = await medicoService.deleteMedico(DNI);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el médico' });
    }
};


const medicos = {

    createMedico,
    deleteMedico,
    verPerfilMedico,
    verMedicos,
    updateMedico,
};

export default medicos;


