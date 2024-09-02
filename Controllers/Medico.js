import { client } from "../db.js";
import crypto from 'node:crypto';
import medicoService from '../services/medicoService.js';

    
// Agregar un nuevo médico
const createMedico = async (req, res) => {
    const { DNI, Nombre, Apellido, mail, contraseña, matricula, Hospital } = req.body;
        const medico = await medicoService.createMedico(DNI, Nombre, Apellido, mail, contraseña, matricula, Hospital);

        // Validación del mail
    validaciones.mail(mail);
    
    // Validación de la contraseña
    validaciones.contraseña(contraseña);
    
    // Validación de la matrícula
    validaciones.matricula(matricula);
    
    // Validación del DNI
    validaciones.DNI(DNI);

    // Validacion nombre y apellido 
    validaciones.Nombre(Nombre);
    validaciones.Apellido( Apellido);

    // Validacion de Hospital
    validaciones.Hospital(Hospital);

    // Validacion de que todos los campos son obligatorios
    if (!DNI || !Nombre || !Apellido || !mail || !contraseña || !matricula || !Hospital) 
        throw new Error('Todos los campos son obligatorios');
    
     //mail ya en uso
     const user = await User.findOne({ mail });
     if (user) throw new Error('este mail ya está en uso');
 
        res.status(201).json(medico);
};

//login
const loginMedico = async (req, res) => {
    const { mail, contraseña } = req.body;
    validaciones.mail(mail);
    validaciones.contraseña(contraseña);

   // Consulta al servicio para obtener al médico basado en el correo
   const medico = await medicoService.loginMedico(mail, contraseña);

   // Si no se encuentra un médico con ese correo, se retorna un error
   if (!medico) {
       return res.status(404).json({ error: 'Usuario no existe' });
   }

   // Comparación de la contraseña proporcionada con la almacenada
   const isValid = bcrypt.compareSync(contraseña, medico.contraseña);
   if (!isValid) {
       return res.status(401).json({ error: 'Contraseña incorrecta' });
   }

   // Si todo es correcto, se retorna el objeto del médico
   res.status(200).json(medico);
}

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

class validaciones {
    static DNI (DNI) {
        if (typeof DNI != 'string') throw new Error('DNI must be a string');
        if (DNI.length != 8) throw new Error('DNI debe contener 8 caracteres');
    }

    static contraseña (contraseña) {
        if (typeof contraseña != 'string') throw new Error('contraseña must be a string');
        if (contraseña.length < 8) throw new Error('contraseña debe tener más de ocho caracteres');
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(contraseña)) throw new Error(`contraseña debe contener al menos una 
            letra mayúscula, una minúscula, un número y un carácter especial`);
    }

    static Nombre (Nombre) {
        const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(Nombre)) throw new Error('Nombre debe contener solo letras');
    if (Nombre.length > 50) throw new Error('Nombre no puede tener más de 50 caracteres');
    }

    static Apellido (Apellido) {
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(Apellido)) throw new Error('Apellido debe contener solo letras');
        if (Apellido.length > 50) throw new Error('Apellido no puede tener más de 50 caracteres');  
    }

    static Hospital (Hospital){
        if (typeof Hospital != 'string' || Hospital.trim() === '') throw new Error('Hospital must be a non-empty string');
        if (Hospital.length < 3) throw new Error('Hospital debe tener al menos 3 caracteres');
        if (Hospital.length > 100) throw new Error('Hospital no puede tener más de 100 caracteres');
    }
    static matricula (matricula){
        if (typeof matricula != 'string') throw new Error('matricula must be a string');
    if (matricula.length != 8) throw new Error('Matrícula debe contener 8 caracteres');
    }

    static mail(mail){
        if (typeof mail != 'string') throw new Error('mail must be a string');
    if (mail.length < 3) throw new Error('mail debe tener más de tres caracteres');
    if (!mail.includes('@')) throw new Error('mail debe contener un @');
    if (mail.length > 100) throw new Error('mail no puede tener más de 100 caracteres');
    
    }
}


const medicos = {

    createMedico,
    loginMedico,
    deleteMedico,
    verPerfilMedico,
    verMedicos,
    updateMedico,
};

export default medicos;


