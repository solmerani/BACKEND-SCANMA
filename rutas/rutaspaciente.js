import pacientes from "../Controllers/Paciente.js";
import express from 'express';
const routerP = express.Router();

//Agregar un usuario a Paciente
routerP.post("/", pacientes.createPaciente);
//Ver perfil de un Paciente
routerP.get("/:DNI", pacientes.verPerfilPaciente);
//Ver todos los pacientes
routerP.get("/", pacientes.verPacientes);
//Ver todos los pacientes de un medico
routerP.get("/pacientesMedico/:DNIMedico", pacientes.verPacientesMedico);
//Eliminar un usuario de Paciente 
routerP.delete("/:DNI", pacientes.deletePaciente);

export default routerP;