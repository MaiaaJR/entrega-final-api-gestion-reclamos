import * as administradoresServices from '../services/administradoresServices.js'; 


//----------------------------- INCIO DE SESIÓN Y REGISTRO DE ADMINISTRADOR -----------------------------

// CONTROLADOR PARA INICIAR SESIÓN DE UN ADMINISTRADOR
export const iniciarSesion = async (req, res) => { 
    try {
        const { correoElectronico, contrasenia } = req.body; 
        const { token } = await administradoresServices.iniciarSesion(correoElectronico, contrasenia); 
        return res.status(200).json({ mensaje: '¡Sesión iniciada exitosamente!', token }); 
    } catch (error) {
        return res.status(401).json({ mensaje: error.message });
    } 
};



// CONTROLADOR PARA REGISTRAR UN ADMINISTRADOR
export const registrarAdministrador = async (req, res) => { 
    try {
        const { nombre, apellido, correoElectronico, contrasenia } = req.body; 
        const usuario = await administradoresServices.registrarAdministrador({ nombre, apellido, correoElectronico, contrasenia }); 
        return res.status(201).json({ mensaje: '¡Usuario registrado exitosamente!', usuario }); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};




//----------------------------- TIPOS DE RECLAMOS -----------------------------

// CONTROLADOR PARA OBTENER LOS TIPOS DE RECLAMOS
export const obtenerTiposReclamos = async (req, res) => { 
    try {
        const tiposReclamos = await administradoresServices.obtenerTiposReclamos();
        return res.status(200).json({ mensaje: 'Lista de tipos de reclamos', tiposReclamos }); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};


// CONTROLADOR PARA CREAR UN TIPO DE RECLAMO
export const crearTipoReclamo = async (req, res) => { 
    try {
        const { descripcion } = req.body; 
        const nuevoTipoReclamo = await administradoresServices.crearTipoReclamo({ descripcion }); 
        return res.status(201).json({ mensaje: 'Tipo de reclamo creado', nuevoTipoReclamo }); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};


// CONTROLADOR PARA ACTUALIZAR UN TIPO DE RECLAMO
export const actualizarTipoReclamo = async (req, res) => { 
    try {
        const { idReclamoEstado } = req.params; 
        const datos = req.body; 
        const tipoReclamoActualizado = await administradoresServices.actualizarTipoReclamo(idReclamoEstado, datos); 
        return res.status(200).json(tipoReclamoActualizado); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};


// CONTROLADOR PARA ELIMINAR UN TIPO DE RECLAMO
export const eliminarTipoReclamo = async (req, res) => { 
    try {
        const { idReclamoEstado } = req.params; 
        const resultado = await administradoresServices.eliminarTipoReclamo(idReclamoEstado); 
        return res.status(200).json(resultado); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};





//----------------------------- EMPLEADOS -----------------------------

// CONTROLADOR PARA OBTENER EMPLEADOS
export const obtenerEmpleados = async (req, res) => { 
    try {
        const empleados = await administradoresServices.obtenerEmpleados(); 
        return res.status(200).json( { mensaje: 'Lista de empleados:', empleados });
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};


// CONTROLADOR PARA CREAR UN EMPLEADO
export const crearEmpleado = async (req, res) => { 
    try {
        const { nombre, apellido, correoElectronico, contrasenia, idUsuarioTipo } = req.body; 
        const nuevoEmpleado = await administradoresServices.crearEmpleado({ nombre, apellido, correoElectronico, contrasenia, idUsuarioTipo }); 
        return res.status(201).json(nuevoEmpleado);
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};


// CONTROLADOR PARA ACTUALIZAR UN EMPLEADO
export const actualizarEmpleado = async (req, res) => { 
    try {
        const { idUsuario } = req.params; 
        const datos = req.body; 
        const empleadoActualizado = await administradoresServices.actualizarEmpleado(idUsuario, datos);
        return res.status(200).json(empleadoActualizado); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};


// CONTROLADOR PARA ELIMINAR UN EMPLEADO
export const eliminarEmpleado = async (req, res) => { 
    try {
        const { idUsuario } = req.params; 
        const resultado = await administradoresServices.eliminarEmpleado(idUsuario);
        return res.status(200).json(resultado); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};




//----------------------------- OFICINAS -----------------------------

// CONTROLADOR PARA OBTENER OFICINAS
export const obtenerOficinas = async (req, res) => { 
    try {
        const oficinas = await administradoresServices.obtenerOficinas(); 
        return res.status(200).json( {mensaje: 'Lista de oficinas:', oficinas} ); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};

// CONTROLADOR PARA CREAR UNA OFICINA
export const crearOficina = async (req, res) => { 
    try {
        const { nombre, idReclamoTipo } = req.body; 
        const nuevaOficina = await administradoresServices.crearOficina({ nombre, idReclamoTipo }); 
        return res.status(201).json(nuevaOficina); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};

// CONTROLADOR PARA ACTUALIZAR UNA OFICINA
export const actualizarOficina = async (req, res) => { 
    try {
        const { idOficina } = req.params;
        const { nombre } = req.body;
        const oficinaActualizada = await administradoresServices.actualizarOficina(idOficina, { nombre }); 
        return res.status(200).json(oficinaActualizada);
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};


// CONTROLADOR PARA ELIMINAR UNA OFICINA
export const eliminarOficina = async (req, res) => { 
    try {
        const { idOficina } = req.params; 
        const resultado = await administradoresServices.eliminarOficina(idOficina); 
        return res.status(200).json(resultado); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};




//----------------------------- ASIGNACIONES DE EMPLEADOS A OFICINAS -----------------------------

// CONTROLADOR PARA AGREGAR UN EMPLEADO A UNA OFICINA
export const agregarEmpleadoAOficina = async (req, res) => { 
    try {
        const { idOficina, idUsuario } = req.params; 
        const resultado = await administradoresServices.agregarEmpleadoAOficina(idOficina, idUsuario); 
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};

// CONTROLADOR PARA ELIMINAR UN EMPLEADO DE UNA OFICINA
export const eliminarEmpleadoDeOficina = async (req, res) => {
    try {
        const { idOficina, idUsuario } = req.params; 
        const resultado = await administradoresServices.eliminarEmpleadoDeOficina(idOficina, idUsuario); 
        return res.status(200).json(resultado); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};




//----------------------------- INFORMES Y ESTADÍSTICAS -----------------------------

// CONTROLADOR PARA GENERAR UN INFORME
export const informe = async (req, res) => { 
    try {
        const formato = req.query.formato;
        if (!formato || !['pdf', 'csv'].includes(formato)) { 
            return res.status(400).send({
                estado: "Falla",
                mensaje: "formato inválido"
            }); 
        }

        const { buffer, path, headers } = await administradoresServices.generarInforme(formato);

        res.set(headers); 

        if (formato === 'pdf') { 
            res.status(200).end(buffer);

        } else if (formato === 'csv') { 
            res.status(200).download(path, (err) => { 
                if (err) {
                    return res.status(500).send({
                        estado: "Falla",
                        mensaje: "Error al generar el informe"
                    });
                }
            }); 
        }
    } catch (error) { //
        return res.status(400).json({ mensaje: error.message });
    } 
};


// CONTROLADOR PARA OBTENER ESTADÍSTICAS DE RECLAMOS
export const obtenerEstadisticasReclamos = async (req, res) => { 
    try {
        const estadisticas = await administradoresServices.obtenerEstadisticasReclamos(); 
        return res.status(200).json(estadisticas); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};


// CONTROLADOR PARA OBTENER ESTADÍSTICAS DE USUARIOS POR OFICINA
export const obtenerEstadisticasUsuariosPorOficina = async (req, res) => { 
    try {
        const estadisticas = await administradoresServices.obtenerEstadisticasUsuariosPorOficina();
        return res.status(200).json(estadisticas); 
    } catch (error) {
        return res.status(400).json({ mensaje: error.message });
    } 
};