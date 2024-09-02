

import router from './rutas/rutasmedico.js';
import rutaspaciente from './rutas/rutaspaciente.js';
import rutasanalisis from './rutas/rutasanalisis.js';
import express from "express";

// Creamos el servidor de Express con la configuración estándar básica
const app = express();

//middlewar

app.use(express.json());       // Parseo de JSON
//rutas
app.use('/api/medicos', router); 
app.use('/api/pacientes', rutaspaciente); 


// Asociamos la ruta "/" a la función pasada como segundo parámetro
app.get("/", (req, res) => {
    // Esto envía el texto "Hello World!" como respuesta a la HTTP request
    res.send("Hello World!");
});


// Iniciamos el servidor en el puerto 3000
app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});













