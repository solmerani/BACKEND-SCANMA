import express from 'express';
import medicos from "../Controllers/Medico.js";
const router = express.Router();


// Definir las rutas para médicos
router.post("/register", medicos.createMedico);
// router.post("/Medico/:login", medicos.loginMedico);
router.post("/login", medicos.loginMedico);
router.get("/Medico/:DNI", medicos.verPerfilMedico);
router.get("/Medico", medicos.verMedicos);
router.post("/", medicos.cambiarContraseña);
router.delete("/Medico/:DNI", medicos.deleteMedico);



export default router;