import Usuarios from '../dataAccess/usuarios.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import NotificacionesService from './notificacionesServices.js'; 
import Reclamos from '../dataAccess/reclamos.js'; 

const notificacionesService = new NotificacionesService(); 
const usuarios = new Usuarios(); 
const reclamos = new Reclamos(); 

//----------------------------------- INICIO DE SESIÓN -----------------------------------//

export const iniciarSesion = async (correoElectronico, contrasenia) => { 
    const usuario = await usuarios.buscar(correoElectronico); 
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    } 

    const contraseniaValida = bcrypt.compareSync(contrasenia, usuario.contrasenia);
    if (!contraseniaValida) {
        throw new Error('Contraseña incorrecta');
    } 

    const token = jwt.sign({ idUsuario: usuario.idUsuario, idUsuarioTipo: usuario.idUsuarioTipo }, 'gestion_reclamos', { expiresIn: '2h' }); 
    return { token, usuario }; 
};


//----------------------------- OBTENER RECLAMOS POR EMPLEADO -----------------------------//

export const obtenerReclamosEmpleado = async (idUsuario) => {
    const reclamosEmpleado = await reclamos.buscarPorEmpleado(idUsuario);
    return reclamosEmpleado;
};


//------------------------------- CAMBIAR ESTADO DE RECLAMO -------------------------------//

export const cambiarEstadoReclamo = async (idReclamo, nuevoEstado, idUsuario) => { 
    const reclamoExistente = await reclamos.buscarPorId(idReclamo); 
    if (!reclamoExistente) {
        throw new Error('El reclamo no existe.');
    } 

    const perteneceOficina = await reclamos.verificarEmpleadoOficina(idReclamo, idUsuario); 
    if (!perteneceOficina) {
        throw new Error('No tienes permiso para cambiar el estado de este reclamo.');
    }

    const resultado = await reclamos.cambiarEstado(idReclamo, nuevoEstado, idUsuario); 
    if (!resultado) {
        throw new Error('No se pudo cambiar el estado del reclamo.');
    } 

    const datosCliente = await reclamos.buscarInformacionClientePorReclamo(idReclamo); 
    if (!datosCliente || !datosCliente.correoElectronico) {
        throw new Error('No se encontraron datos del cliente para enviar la notificación.');
    } 

    const notificacionEnviada = await notificacionesService.enviarCorreo({ 
        nombre: datosCliente.nombreCompleto,
        correoElectronico: datosCliente.correoElectronico,
        reclamo: idReclamo,
        estado: nuevoEstado
    }); 
    
    if (!notificacionEnviada.estado) {
        throw new Error('Error al enviar la notificación: ' + notificacionEnviada.mensaje);
    } 

    return { mensaje: 'Estado del reclamo actualizado y notificación enviada al cliente.'}; 
};