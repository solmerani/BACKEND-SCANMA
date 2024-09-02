import express from 'express';
import medicos from "../Controllers/Medico.js";
const router = express.Router();


// Definir las rutas para médicos
router.post("/Medico", medicos.createMedico);
router.get("/Medico/:id", medicos.verPerfilMedico);
router.get("/Medico", medicos.verMedicos);
router.put("/Medico/:id", medicos.updateMedico);
router.delete("/Medico/:id", medicos.deleteMedico);
router.post('/Medico', medicos.loginMedico);


export default router;