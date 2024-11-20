import express from 'express';
import * as clientesController from '../controllers/clientesController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarRol } from '../middlewares/rolesMiddleware.js';

const router = express.Router();

router.post('/login', clientesController.iniciarSesion);
router.post('/registrar', clientesController.registrarCliente);
router.post('/crearReclamo', verificarToken, verificarRol(3), clientesController.crearReclamo);
router.get('/listarReclamos', verificarToken, verificarRol(3), clientesController.obtenerReclamos);
router.put('/cancelarReclamo/:idReclamo', verificarToken, verificarRol(3), clientesController.cancelarReclamo);
router.put('/perfil', verificarToken, verificarRol(3), clientesController.actualizarPerfil);

export default router;