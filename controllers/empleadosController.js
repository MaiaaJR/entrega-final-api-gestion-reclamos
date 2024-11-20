import * as empleadosServices from '../services/empleadosServices.js';

// CONTROLADOR PARA INICIAR SESIÓN
export const iniciarSesion = async (req, res) => { 
    try {
        const { correoElectronico, contrasenia } = req.body; 
        const { token } = await empleadosServices.iniciarSesion(correoElectronico, contrasenia); 
        return res.status(200).json({ mensaje: '¡Sesión iniciada exitosamente!', token }); 
    } catch (error) { 
        return res.status(401).json({ mensaje: error.message });
    } 
};


// CONTROLADOR PARA OBTENER LOS RECLAMOS DE UN EMPLEADO
export const obtenerReclamos = async (req, res) => { 
    try {
        const { idUsuario } = req.usuario;  
        const reclamosEmpleado = await empleadosServices.obtenerReclamosEmpleado(idUsuario); 
        return res.status(200).json({ mensaje: 'Lista de reclamos obtenida con éxito!', reclamos: reclamosEmpleado }); 
    } catch (error) { 
        return res.status(500).json({ mensaje: error.message });
    } 
};


// CONTROLADOR PARA CAMBIAR EL ESTADO DE UN RECLAMO
export const cambiarEstado = async (req, res) => { 
    try {
        const { idReclamo, nuevoEstado } = req.body;  
        const { idUsuario } = req.usuario; 
        const resultado = await empleadosServices.cambiarEstadoReclamo(idReclamo, nuevoEstado, idUsuario); 
        if (!resultado) {
            return res.status(400).json({ mensaje: 'No se pudo cambiar el estado del reclamo.' });
        } 
        return res.status(200).json({ mensaje: 'Estado del reclamo actualizado con éxito.' }); 
    } catch (error) { 
        return res.status(500).json({ mensaje: error.message });
    } 
};