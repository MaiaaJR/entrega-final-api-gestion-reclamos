import express from 'express';
import * as administradoresController from '../controllers/administradoresController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarRol } from '../middlewares/rolesMiddleware.js';

const router = express.Router();

// RUTAS PARA INICIAR SESIÓN Y REGISTRAR ADMINISTRADORES
router.post('/login', administradoresController.iniciarSesion);
router.post('/registrar', administradoresController.registrarAdministrador);

// RUTAS PARA GESTIONAR TIPOS DE RECLAMOS
router.get('/tiposReclamos', verificarToken, verificarRol(1), administradoresController.obtenerTiposReclamos);
router.post('/crearTipoReclamo', verificarToken, verificarRol(1), administradoresController.crearTipoReclamo);
router.put('/actualizarTipoReclamo/:idReclamoEstado', verificarToken, verificarRol(1), administradoresController.actualizarTipoReclamo);
router.put('/eliminarTipoReclamo/:idReclamoEstado', verificarToken, verificarRol(1), administradoresController.eliminarTipoReclamo);

// RUTAS PARA GESTIONAR EMPLEADOS
router.get('/empleados', verificarToken, verificarRol(1), administradoresController.obtenerEmpleados);
router.post('/crearEmpleado', verificarToken, verificarRol(1), administradoresController.crearEmpleado);
router.put('/actualizarEmpleado/:idUsuario', verificarToken, verificarRol(1), administradoresController.actualizarEmpleado);
router.put('/eliminarEmpleado/:idUsuario', verificarToken, verificarRol(1), administradoresController.eliminarEmpleado);

// RUTAS PARA GESTIONAR OFICINAS
router.get('/oficinas', verificarToken, verificarRol(1), administradoresController.obtenerOficinas);
router.post('/crearOficina', verificarToken, verificarRol(1), administradoresController.crearOficina);
router.put('/actualizarOficina/:idOficina', verificarToken, verificarRol(1), administradoresController.actualizarOficina);
router.put('/eliminarOficina/:idOficina', verificarToken, verificarRol(1), administradoresController.eliminarOficina);

// RUTAS PARA GESTIONAR USUARIOS DE OFICINAS
router.post('/oficina/:idOficina/empleado/:idUsuario', verificarToken, verificarRol(1), administradoresController.agregarEmpleadoAOficina);
router.put('/oficina/:idOficina/empleado/:idUsuario', verificarToken, verificarRol(1), administradoresController.eliminarEmpleadoDeOficina);

// RUTAS PARA OBTENER ESTADÍSTICAS E INFORMES
router.get('/estadisticasReclamos', verificarToken, verificarRol(1), administradoresController.obtenerEstadisticasReclamos);
router.get('/informe', verificarToken, verificarRol(1), administradoresController.informe);
router.get('/estadisticasUsuariosPorOficina', verificarToken, verificarRol(1), administradoresController.obtenerEstadisticasUsuariosPorOficina);

export default router;