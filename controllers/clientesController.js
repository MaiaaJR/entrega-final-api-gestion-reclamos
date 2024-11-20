import * as clientesServices from '../services/clientesServices.js'; 

// CONTROLADOR PARA INICIAR SESIÓN
export const iniciarSesion = async (req, res) => { 
    try {
        const { correoElectronico, contrasenia } = req.body;
        const { token } = await clientesServices.iniciarSesion(correoElectronico, contrasenia); 
        return res.status(200).json({ mensaje: '¡Sesión iniciada exitosamente!', token }); 
    } catch (error) {
        return res.status(401).json({ mensaje: error.message });
    } 
};



// CONTROLADOR PARA REGISTRAR UN CLIENTE
export const registrarCliente = async (req, res) => { 
    try {
        const { nombre, apellido, correoElectronico, contrasenia } = req.body; 
        const usuario = await clientesServices.registrarUsuario({ nombre, apellido, correoElectronico, contrasenia, idUsuarioTipo: 3 }); 
        return res.status(201).json({ mensaje: '¡Usuario registrado exitosamente!', usuario }); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};



// CONTROLADOR PARA CREAR UN RECLAMO
export const crearReclamo = async (req, res) => { 
    try {
        const { asunto, descripcion, idReclamoTipo } = req.body; 
        const idUsuarioCreador = req.usuario.idUsuario; 
        await clientesServices.crearReclamo({ asunto, descripcion, idReclamoTipo, idUsuarioCreador }); 
        return res.status(201).json({ mensaje: 'Reclamo creado'}); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};



// CONTROLADOR PARA OBTENER LOS RECLAMOS DE UN CLIENTE
export const obtenerReclamos = async (req, res) => { 
    try {
        const idUsuario = req.usuario.idUsuario; 
        const reclamos = await clientesServices.obtenerReclamosPorUsuario(idUsuario); 
        return res.status(200).json({ mensaje: 'Lista de reclamos obtenida con éxito!', reclamos }); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};



// CONTROLADOR PARA CANCELAR EL RECLAMO DE UN CLIENTE
export const cancelarReclamo = async (req, res) => { 
    try {
        const { idReclamo } = req.params; 
        const idUsuario = req.usuario.idUsuario; 
        const resultado = await clientesServices.cancelarReclamo(idReclamo, idUsuario); 
        return res.status(200).json({ mensaje: resultado.mensaje }); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};



// CONTROLADOR PARA ACTUALIZAR EL PERFIL DE UN CLIENTE
export const actualizarPerfil = async (req, res) => { 
    try {
        const idUsuario = req.usuario.idUsuario; 
        const { nombre, apellido, correoElectronico, contrasenia, imagen } = req.body; 
        const resultado = await clientesServices.actualizarPerfil(idUsuario, { nombre, apellido, correoElectronico, contrasenia, imagen }); 
        return res.status(200).json({ mensaje: resultado.mensaje }); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};