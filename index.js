

import router from './rutas/rutasmedico.js';
import routerP from './rutas/rutaspaciente.js';
import routerA from './rutas/rutasanalisis.js';
import express from "express";
import cors from "cors";

// Creamos el servidor de Express con la configuración estándar básica
const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));

//middlewar

app.use(express.json());       // Parseo de JSON
//rutas
app.use('/api/medicos', router); 
app.use('/api/pacientes', routerP); 
app.use('/api/analisis', routerA);


// Asociamos la ruta "/" a la función pasada como segundo parámetro
app.get("/", (req, res) => {
    // Esto envía el texto "Hello World!" como respuesta a la HTTP request
    res.send("Hello World!");
});


// Iniciamos el servidor en el puerto 3000
app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});











