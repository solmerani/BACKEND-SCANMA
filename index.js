
import express from "express";
// Creamos el servidor de Express con la configuración estándar básica
const app = express();
app.use(express.json());


import medicos from "./Controllers/Medico.js";
import pacientes from "./Controllers/Paciente.js";

// Asociamos la ruta "/" a la función pasada como segundo parámetro
app.get("/", (req, res) => {
    // Esto envía el texto "Hello World!" como respuesta a la HTTP request
    res.send("Hello World!");
});

// Iniciamos el servidor en el puerto 3000
app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});




//........Rutas.......//

//Medico Rutas
//Agregar un usuario a Medico
app.post("/Medico", medicos.createMedico);
//Ver perfil de un Medico
app.get("/Medico/:DNI", medicos.verPerfilMedico);
//Eliminar un usuario 
app.delete("/Medico/:DNI", medicos.deleteMedico);




//Paciente Rutas
//Agregar un usuario a Paciente
app.post("/Paciente", pacientes.createPaciente);
//Ver perfil de un Paciente
app.get("/Paciente/:DNI", pacientes.verPerfilPaciente);
//Eliminar un usuario de Paciente 
app.delete("/Medico/:DNI", pacientes.deletePaciente);

