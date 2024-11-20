import express from 'express';
import * as empleadosController from '../controllers/empleadosController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarRol } from '../middlewares/rolesMiddleware.js';

const router = express.Router();

router.post('/login', empleadosController.iniciarSesion); 
router.get('/obtenerReclamos', verificarToken, verificarRol(2), empleadosController.obtenerReclamos); 
router.put('/cambiarEstadoReclamo', verificarToken, verificarRol(2), empleadosController.cambiarEstado); 

export default router;