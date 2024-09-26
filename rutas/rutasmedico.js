import express from 'express';
import medicos from "../Controllers/Medico.js";
const router = express.Router();


// Definir las rutas para médicos
router.post("/register", medicos.createMedico);
router.post("/login", medicos.loginMedico);
router.get("/:DNI", medicos.verPerfilMedico);
router.get("/", medicos.verMedicos);
router.put("/newpassword", medicos.cambiarContraseña);
router.delete("/:DNI", medicos.deleteMedico);

export default router;