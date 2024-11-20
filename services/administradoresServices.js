import Usuarios from '../dataAccess/usuarios.js'; 
import Oficinas from '../dataAccess/oficinas.js'; 
import ReclamosTipo from '../dataAccess/reclamosTipo.js'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import Reclamos from '../dataAccess/reclamos.js'; 
import InformeService from './informeServices.js'; 

const usuarios = new Usuarios(); 
const oficinas = new Oficinas(); 
const reclamosTipo = new ReclamosTipo(); 
const reclamos = new Reclamos();
const informes = new InformeService();


//----------------------------------- INICIO DE SESIÓN DE ADMIN -----------------------------------//

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


//-------------------------------- REGISTRO DE ADMINISTRADOR --------------------------------//

export const registrarAdministrador = async ({ nombre, apellido, correoElectronico, contrasenia }) => { 
    const usuarioExistente = await usuarios.buscar(correoElectronico); 
    if (usuarioExistente) {
        throw new Error('El usuario ya existe');
    } 

    const salt = bcrypt.genSaltSync(10); 
    const hashContrasenia = bcrypt.hashSync(contrasenia, salt); 

    const nuevoUsuario = await usuarios.crear({ nombre, apellido, correoElectronico, contrasenia: hashContrasenia, idUsuarioTipo: 1 }); 
    if (!nuevoUsuario) {
        throw new Error('No se pudo crear el usuario');
    } 

    return nuevoUsuario;
};



//---------------------------------- GESTION DE TIPOS DE RECLAMOS ----------------------------------//

// Obtener todos los tipos de reclamos
export const obtenerTiposReclamos = async () => { 
    return await reclamosTipo.buscarTodos(); 
};

// Crear un nuevo tipo de reclamo
export const crearTipoReclamo = async ({ descripcion }) => { 
    const nuevoTipoReclamo = await reclamosTipo.crear({ descripcion }); 
    if (!nuevoTipoReclamo) {
        throw new Error('No se pudo crear el tipo de reclamo');
    } 
    return nuevoTipoReclamo; 
};

// Actualizar un tipo de reclamo
export const actualizarTipoReclamo = async (idReclamoTipo, datos) => { 
    const tipoReclamoActualizado = await reclamosTipo.modificar(idReclamoTipo, datos); 
    if (!tipoReclamoActualizado) {
        throw new Error('No se pudo actualizar el tipo de reclamo');
    } 
    return { mensaje: 'Tipo de reclamo actualizado' }; 
};

// Eliminar un tipo de reclamo
export const eliminarTipoReclamo = async (idReclamoTipo) => { 
    const tipoReclamo = await reclamosTipo.buscarPorId(idReclamoTipo); 
    if (!tipoReclamo) {
        throw new Error('Tipo de reclamo no encontrado');
    }

    const eliminado = await reclamosTipo.eliminar(idReclamoTipo); 
    if (!eliminado) {
        throw new Error('No se pudo eliminar el tipo de reclamo');
    } 
    return { mensaje: 'Tipo de reclamo eliminado' }; 
};



//---------------------------------- GESTION DE EMPLEADOS ----------------------------------//

// Obtener todos los empleados
export const obtenerEmpleados = async () => { 
    return await usuarios.buscarTodosEmpleados(); 
};

// Crear un nuevo empleado
export const crearEmpleado = async ({ nombre, apellido, correoElectronico, contrasenia, idUsuarioTipo }) => {

    const empleadoExistente = await usuarios.buscar(correoElectronico); 
    if (empleadoExistente) {
        throw new Error('El empleado ya existe');
    } 

    const salt = bcrypt.genSaltSync(10);
    const hashContrasenia = bcrypt.hashSync(contrasenia, salt); 

    const nuevoEmpleado = await usuarios.crear({ nombre, apellido, correoElectronico, contrasenia: hashContrasenia, idUsuarioTipo }); 
    if (!nuevoEmpleado) {
        throw new Error('No se pudo crear el empleado');
    } 

    return nuevoEmpleado;
};

// Actualizar un empleado
export const actualizarEmpleado = async (idUsuario, datos) => { 
    const { nombre, apellido, correoElectronico, contrasenia } = datos;

    if (!nombre || !apellido || !correoElectronico || !contrasenia) {
        throw new Error('Todos los campos son obligatorios');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashContrasenia = bcrypt.hashSync(contrasenia, salt);

    const datosActualizados = {
        nombre,
        apellido,
        correoElectronico,
        contrasenia: hashContrasenia
    };

    const empleadoActualizado = await usuarios.modificar(idUsuario, datosActualizados); 
    if (!empleadoActualizado) {
        throw new Error('No se pudo actualizar el empleado');
    } 

    return { mensaje: 'Perfil de empleado actualizado' };
};

// Eliminar un empleado
export const eliminarEmpleado = async (idUsuario) => { 
    const empleado = await usuarios.buscarPorId(idUsuario); 
    if (!empleado) {
        throw new Error('Empleado no encontrado');
    } 
    
    const eliminado = await usuarios.eliminar(idUsuario); 
    if (!eliminado) {
        throw new Error('No se pudo eliminar el empleado'); 
    } 
    return { mensaje: 'Empleado eliminado' }; 
};



//---------------------------------- GESTION DE OFICINAS ----------------------------------//

// Obtener todas las oficinas
export const obtenerOficinas = async () => { 
    return await oficinas.buscarTodos(); 
};

// Crear una nueva oficina
export const crearOficina = async ({ nombre, idReclamoTipo }) => { 
    const oficinaExistente = await oficinas.buscarPorReclamoTipo(idReclamoTipo); 
    if (oficinaExistente) {
        throw new Error('Ya existe una oficina que atiende este tipo de reclamo');
    }

    const nuevaOficina = await oficinas.crear({ nombre, idReclamoTipo });
    if (!nuevaOficina) {
        throw new Error('No se pudo crear la oficina');
    } 

    return nuevaOficina; 
};

// Actualizar una oficina
export const actualizarOficina = async (idOficina, { nombre }) => { 
    const oficinaActualizada = await oficinas.modificar(idOficina, { nombre }); 
    if (!oficinaActualizada) {
        throw new Error('No se pudo actualizar la oficina');
    } 
    return { mensaje: 'Oficina Actualizada' }
};

// Eliminar una oficina
export const eliminarOficina = async (idOficina) => { 
    const oficina = await oficinas.buscarPorId(idOficina); 
    if (!oficina) {
        throw new Error('Oficina no encontrada');
    } 

    const eliminado = await oficinas.eliminar(idOficina); 
    if (!eliminado) {
        throw new Error('No se pudo eliminar la oficina');
    } 
    return { mensaje: 'Oficina eliminada' }; 
};

// Agregar un empleado a una oficina
export const agregarEmpleadoAOficina = async (idOficina, idUsuario) => { 
    const oficina = await oficinas.buscarPorId(idOficina); 
    if (!oficina) {
        throw new Error('Oficina no encontrada o inactiva');
    } 

    const empleado = await usuarios.buscarPorId(idUsuario); 
    if (!empleado) {
        throw new Error('Empleado no encontrado');
    } 

    if (empleado.idUsuarioTipo !== 2) { 
        throw new Error('El usuario no es un empleado');
    }

    const asignacionExistente = await oficinas.buscarAsignacion(idUsuario, idOficina); 
    if (asignacionExistente) {
        throw new Error('El empleado ya está asignado a esta oficina');
    }

    const asignacion = await oficinas.asignarOficinaAEmpleado(idUsuario, idOficina); 
    if (!asignacion) {
        throw new Error('No se pudo agregar el empleado a la oficina');
    } 

    return { mensaje: 'Empleado agregado a la oficina' }; 
};

// Eliminar un empleado de una oficina
export const eliminarEmpleadoDeOficina = async (idOficina, idUsuario) => { 
    const oficina = await oficinas.buscarPorId(idOficina); 
    if (!oficina) {
        throw new Error('Oficina no encontrada o inactiva');
    } 

    const empleado = await usuarios.buscarPorId(idUsuario); 
    if (!empleado) {
        throw new Error('Empleado no encontrado');
    } 

    if (empleado.idUsuarioTipo !== 2) {
        throw new Error('El usuario no es un empleado');
    }

    const asignacionExistente = await oficinas.buscarAsignacion(idUsuario, idOficina); 
    if (!asignacionExistente) {
        throw new Error('El empleado no está asignado a esta oficina o ya fue eliminado');
    }

    const eliminacion = await oficinas.eliminarEmpleadoDeOficina(idUsuario, idOficina); 
    if (!eliminacion) {
        throw new Error('No se pudo eliminar la asignación del empleado a la oficina');
    } 

    return { mensaje: 'Empleado eliminado de la oficina' }; 
};


//---------------------------------- INFORMES Y ESTADÍSTICAS ----------------------------------//

// Generar un informe
export const generarInforme = async (formato) => { 
    if (formato === 'pdf') { 
        return await reportePdf(); 

    } else if (formato === 'csv') { 
        return await reporteCsv(); 
    }
};

// Inorme de reclamos en PDF
const reportePdf = async () => { 
    const datosReporte = await reclamos.buscarDatosReportePdf(); 
    if (!datosReporte || datosReporte.length === 0) { 
        return { estado: false, mensaje: 'No hay datos para generar el reporte'};
    } 

    const pdf = await informes.informeReclamosPdf(datosReporte); 
    return {
        buffer: pdf,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="reporte.pdf"'
        }
    }; 
}

// Informe de reclamos en CSV
const reporteCsv = async () => { 
    const datosReporte = await reclamos.buscarDatosReporteCsv(); 
    if (!datosReporte || datosReporte.length === 0) {
        return {estado: false, mensaje: 'No hay datos para generar el reporte'};
    } 

    const csv =  await informes.informeReclamosCsv(datosReporte);
    return {
        path: csv,
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="reporte.csv"'
        }
    }; 
}

// Obtener estadísticas de los reclamos
export const obtenerEstadisticasReclamos = async () => { 
    return await reclamos.obtenerEstadisticasReclamos(); 
};

// Obtener estadísticas de los usuarios por oficina
export const obtenerEstadisticasUsuariosPorOficina = async () => { 
    return await reclamos.obtenerEstadisticasUsuariosPorOficina(); 
};