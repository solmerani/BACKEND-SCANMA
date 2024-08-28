import pacientes from "../Controllers/Paciente.js";
import express from 'express';
const router = express.Router();

//Agregar un usuario a Paciente
router.post("/Paciente", pacientes.createPaciente);
//Ver perfil de un Paciente
router.get("/Paciente/:DNI", pacientes.verPerfilPaciente);
//Ver todos los pacientes
router.get("/Paciente", pacientes.verPacientes);
//Eliminar un usuario de Paciente 
router.delete("/Medico/:DNI", pacientes.deletePaciente);

export default router;