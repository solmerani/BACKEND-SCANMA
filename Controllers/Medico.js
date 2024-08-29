import { client } from "../db.js";

import medicoService from '../services/medicoService.js';

// Crear usuario
const { Schena } = new DBLocal({path: '/db.js'})

const User = Schena('User', {
    DNI: {type: String, required: true},
    Nombre: {type: String, required: true},
    Apellido: {type: String, required: true},
    mail: {type: String, required: true},
    contraseña: {type: String, required: true},
    matricula: {type: String, required: true},
    Hospital: {type: String, required: true},
})

export class UserRepository {
    static create ({DNI,Nombre,Apellido,mail,contraseña,matricula,Hospital}) {


    }

    
}
// Agregar un nuevo médico
const createMedico = async (req, res) => {
    const { DNI, Nombre, Apellido, mail, contraseña, matricula, Hospital } = req.body;
        const medico = await medicoService.createMedico(DNI, Nombre, Apellido, mail, contraseña, matricula, Hospital);

        // Validación del mail
    if (typeof mail != 'string') throw new Error('mail must be a string');
    if (mail.length < 3) throw new Error('mail debe tener más de tres caracteres');
    if (!mail.includes('@')) throw new Error('mail debe contener un @');
    if (mail.length > 100) throw new Error('mail no puede tener más de 100 caracteres');
    
    // Validación de la contraseña
    if (typeof contraseña != 'string') throw new Error('contraseña must be a string');
    if (contraseña.length < 8) throw new Error('contraseña debe tener más de ocho caracteres');
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(contraseña)) throw new Error(`contraseña debe contener al menos una 
        letra mayúscula, una minúscula, un número y un carácter especial`);
    
    // Validación de la matrícula
    if (typeof matricula != 'string') throw new Error('matricula must be a string');
    if (matricula.length != 8) throw new Error('Matrícula debe contener 8 caracteres');
    
    // Validación del DNI
    if (typeof DNI != 'string') throw new Error('DNI must be a string');
    if (DNI.length != 8) throw new Error('DNI debe contener 8 caracteres');

    // Validacion nombre y apellido 
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(Nombre)) throw new Error('Nombre debe contener solo letras');
    if (!nameRegex.test(Apellido)) throw new Error('Apellido debe contener solo letras');
    if (Nombre.length > 50) throw new Error('Nombre no puede tener más de 50 caracteres');
    if (Apellido.length > 50) throw new Error('Apellido no puede tener más de 50 caracteres');

    // Validacion de Hospital
    if (typeof Hospital != 'string' || Hospital.trim() === '') throw new Error('Hospital must be a non-empty string');
    if (Hospital.length < 3) throw new Error('Hospital debe tener al menos 3 caracteres');
    if (Hospital.length > 100) throw new Error('Hospital no puede tener más de 100 caracteres');

    // Validacion de que todos los campos son obligatorios
    if (!DNI || !Nombre || !Apellido || !mail || !contraseña || !matricula || !Hospital) 
        throw new Error('Todos los campos son obligatorios');
    
    // Asegurarse de que el mail no esté en uso ya para la creación de usuario
    const user = await User.findOne({ mail });
    if (user) throw new Error('este mail ya está en uso');
    
        
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


