
import crypto from 'node:crypto';
import medicoService from '../services/medicoService.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import EnviarMail from '../middleweras/mailer.js';


// Agregar un nuevo médico
const createMedico = async (req, res) => {
    try {
        const { DNI, Nombre, Apellido, mail, contraseña, matricula, Hospital } = req.body;

        // Validación de que todos los campos son obligatorios
        if (!DNI || !Nombre || !Apellido || !mail || !contraseña || !matricula || !Hospital) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // validacion de si el correo esta en uso
        const CorreoEnUso = await medicoService.verificarCorreo(mail);
        if (CorreoEnUso) {
            return res.status(400).json({error:"el mail ya esta en uso"})
        }

        // Validaciónes de los campos
        //contraseña
        if (typeof contraseña != 'string') {
            return res.status(400).json({ error: 'la contraseña debe ser un string' });}
        if (contraseña.length < 8){
            return res.status(400).json({ error: 'contraseña debe tener mas de 8 caracteres' });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(contraseña)){
            return res.status(400).json({ error: `contraseña debe contener al menos una 
            letra mayúscula, una minúscula, un número y un carácter especial` });
        }
        //mail
        if (mail.length < 3) {
            return res.status(400).json({ error: 'el mail debe tener mas de 3 caracteres' });
        }
        if (!mail.includes('@')) {
            return res.status(400).json({ error: 'el mail debe contener un @' });
        }
        if (mail.length > 100) {
            return res.status(400).json({ error: 'el mail no puede tener mas de 100 caracteres ' });
        }
        //matricula
        if (typeof matricula != 'string'){
            return res.status(400).json({ error: 'matricula debe ser un string' });
        }
    if (matricula.length != 8) {
        return res.status(400).json({ error: 'matricula debe tener  8 caracteres' });
    }
       //DNI
       if (typeof DNI != 'string'){
        return res.status(400).json({ error: 'DNI must be a string' });}
        if (DNI.length != 8) {
        return res.status(400).json({ error: 'DNI debe contener 8 carcateres' });}
       
        //nombre
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(Nombre)) {
            return res.status(400).json({ error: 'el nombre debe contener solo letras' });
        }
        if (Nombre.length > 50) {
            return res.status(400).json({ error: 'el nombre no puede tener mas de 50 caracteres' });
        }
        //apellido
        if (!nameRegex.test(Apellido)) {
            return res.status(400).json({ error: 'el apellido debe contener solo letras' });
        }
        if (Apellido.length > 50) {
            return res.status(400).json({ error: 'el Apellido no puede tener mas de 50 caracteres' });
        }
     //hospital
     if (typeof Hospital != 'string' || Hospital.trim() === '') throw new Error('Hospital must be a non-empty string');
        if (Hospital.length < 3) {
            return res.status(400).json({ error: 'hospital debe tener al menos 3 caracteres' }); 
        }
        if (Hospital.length > 100) {
            return res.status(400).json({ error: 'hospital no debe tener mas de 100 caracteres' });
        }

        //Hasheo de contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);
        // Comprobar si el mail ya está en uso
        //const user = await User.findOne({ mail });
        //if (user) {
        //    return res.status(400).json({ error: 'Este mail ya está en uso' });
       // }

        // Creación del médico
        const medico = await medicoService.createMedico(DNI, Nombre, Apellido, mail,  hashedPassword, matricula, Hospital);

        res.status(201).json(medico);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
//login
const loginMedico = async (req, res) => {
    const { mail, password } = req.body;
    const secret = "Scanmaa24";
    console.log(mail); 

    // Verificación de campos obligatorios
    if (!mail || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        console.log("error 1"); 
    }
    
    // Validaciones del correo
    if (mail.length < 3) {
        return res.status(400).json({ error: 'el mail debe tener mas de 3 caracteres' });
        console.log("error 2"); 
    }
    if (!mail.includes('@')) {
        return res.status(400).json({ error: 'el mail debe contener un @' });
        console.log("error 3"); 
    }
    if (mail.length > 100) {
        return res.status(400).json({ error: 'el mail no puede tener mas de 100 caracteres ' });
        console.log("error 4"); 
    }

    // Consulta al servicio para obtener al médico basado en el correo
    const medico = await medicoService.loginMedico(mail);

    // Si no se encuentra un médico con ese correo, se retorna un error
    if (!medico) {
        return res.status(400).json({ error: "El usuario no existe" });
        console.log("error 4"); 
    }

    // Comparación de la contraseña proporcionada con la almacenada
    const isValid = await bcrypt.compare(password, medico.contraseña);
    if (!isValid) {
        return res.status(400).json({ error: "Contraseña incorrecta" });
        console.log("error 5"); 
    }

    // Generar token incluyendo el DNI además del id del médico
    const token = jwt.sign(
        { id: medico.id, dni: medico.dni },  // Incluimos el DNI aquí
        secret,
        { expiresIn: "1h" }
    );

    // Si todo es correcto, se retorna el médico y el token
    res.status(200).json({ medico, token });  // Se incluye el token en la respuesta
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


//recuperacion de contraseña
const SolicitarRecuperacion = async(req,res)=> {
    try {
        const {mail} = req.body;
        const secret = "Scanmaa24";
        console.log(mail);
        const usuario = await medicoService.loginMedico(mail);
        // Si no se encuentra un médico con ese correo, se retorna un error
        if (!usuario) {
            return res.status(400).json({ error: "El usuario no existe" });
        }
         // Genera un token seguro usando el DNI como ID
        const token = jwt.sign(
            { dni: usuario.DNI },  
            secret,
            { expiresIn: "1h" }  // Expira en 1 hora
        );

  // Guarda el token hasheado en tu base de datos (puedes usar un campo en el usuario)
  await medicoService.GuardarToken (usuario.DNI, token); // Implementa esta función según tu lógica


  // Envía el correo con el token original
  await EnviarMail(mail, token);


  res.status(200).json({ message: "Se ha enviado un enlace de recuperación a tu correo." });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
};

//Cambiar contraseña
const cambiarContraseña = async (req, res) => {
    try {
        const { token } = req.query;
        const { newPassword } = req.body;
        const secret = "Scanmaa24";
        const decoded = jwt.verify(token, secret);
        // Verifica el token y la fecha de expiración en la base de datos
      const usuario = await medicoService.verificarToken(token);
      if (!usuario || usuario.resetTokenExpires < new Date()) {
          return res.status(400).json({ message: "Token inválido o expirado" });
      };
            // Hashea la nueva contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Actualiza la contraseña en la base de datos
            await medicoService.cambiarContraseña(decoded.DNI, hashedPassword); // Asegúrate de tener esta función en tu servicio


            res.status(200).json({ message: 'Contraseña cambiada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    loginMedico,
    deleteMedico,
    verPerfilMedico,
    verMedicos,
    cambiarContraseña,
    SolicitarRecuperacion,
   
  
 

};

export default medicos;


