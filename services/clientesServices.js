import Usuarios from '../dataAccess/usuarios.js';
import Reclamos from '../dataAccess/reclamos.js'; 
import ReclamosTipo from '../dataAccess/reclamosTipo.js'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 

const usuarios = new Usuarios(); 
const reclamos = new Reclamos(); 
const reclamosTipo = new ReclamosTipo();

//----------------------------------- INICIO DE SESIÓN DE CLIENTE -----------------------------------//

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



//-------------------------------- REGISTRO DE CLIENTE --------------------------------//

export const registrarUsuario = async ({ nombre, apellido, correoElectronico, contrasenia, idUsuarioTipo }) => { 
    const usuarioExistente = await usuarios.buscar(correoElectronico); 
    if (usuarioExistente) {
        throw new Error('El usuario ya existe');
    } 

    const salt = bcrypt.genSaltSync(10); 
    const hashContrasenia = bcrypt.hashSync(contrasenia, salt); 

    const nuevoUsuario = await usuarios.crear({ nombre, apellido, correoElectronico, contrasenia: hashContrasenia, idUsuarioTipo }); 
    if (!nuevoUsuario) {
        throw new Error('No se pudo crear el usuario');
    } 

    return nuevoUsuario; 
};



//---------------------------------- CREAR RECLAMO ----------------------------------//

export const crearReclamo = async ({ asunto, descripcion, idReclamoTipo, idUsuarioCreador }) => { 
    
    const tipoReclamoExistente = await reclamosTipo.buscarPorId(idReclamoTipo); 
    if (!tipoReclamoExistente) {
        throw new Error('El tipo de reclamo no existe');
    } 
    
    const nuevoReclamo = await reclamos.crear({ asunto, descripcion, idReclamoTipo, idUsuarioCreador }); 
    if (!nuevoReclamo) {
        throw new Error('No se pudo crear el reclamo');
    } 
    return nuevoReclamo; 
};



//------------------------------- OBTENER RECLAMOS POR USUARIO -------------------------------//

export const obtenerReclamosPorUsuario = async (idUsuario) => { 
    const reclamosUsuario = await reclamos.buscarPorUsuario(idUsuario); 
    if (!reclamosUsuario || reclamosUsuario.length === 0) { 
        throw new Error('No se encontraron reclamos para este usuario');
    } 
    return reclamosUsuario; 
};



//------------------------------------- CANCELAR RECLAMO -------------------------------------//

export const cancelarReclamo = async (idReclamo, idUsuario) => { 
    const reclamoExistente = await reclamos.buscarPorId(idReclamo); 
    if (!reclamoExistente) {
        throw new Error('El reclamo no existe');
    }

    const reclamo = await reclamos.sePuedeCancelar(idReclamo); 
    if (!reclamo || reclamo.idUsuarioCreador !== idUsuario) { 
        throw new Error('No se puede cancelar el reclamo');
    } 

    const cancelado = await reclamos.cancelar(idReclamo, idUsuario); 
    if (!cancelado) {
        throw new Error('No se pudo cancelar el reclamo');
    } 

    return { mensaje: 'Reclamo cancelado' }; 
};



//----------------------------------- ACTUALIZAR PERFIL -----------------------------------//

export const actualizarPerfil = async (idUsuario, { nombre, apellido, correoElectronico, contrasenia, imagen }) => { 
    if (!nombre || !apellido || !correoElectronico || !contrasenia || !imagen) {
        throw new Error('Todos los campos son obligatorios');
    } 

    const usuarioActual = await usuarios.buscarPorId(idUsuario); 
    if (!usuarioActual) {
        throw new Error('Usuario no encontrado');
    } 

    const datosActualizados = { 
        nombre,
        apellido,
        correoElectronico,
        contrasenia: bcrypt.hashSync(contrasenia, bcrypt.genSaltSync(10)), 
        imagen
    };

    const actualizado = await usuarios.modificar(idUsuario, datosActualizados);
    if (!actualizado) {
        throw new Error('No se pudo actualizar el perfil');
    } 

    return { mensaje: 'Perfil actualizado' }; 
};