export const verificarRol = (...rolesPermitidos) => { 
    return (req, res, next) => { 
        if (!req.usuario) {
            return res.status(401).json({ mensaje: 'Acceso denegado! No se proporcionó el token.' });
        } 

        const { idUsuarioTipo } = req.usuario;
        if (!rolesPermitidos.includes(idUsuarioTipo)) {
            return res.status(403).json({ mensaje: 'Acceso denegado! No tienes permiso para realizar esta acción.' });
        } 

        next(); 
    };
};