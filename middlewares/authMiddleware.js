import jwt from 'jsonwebtoken'; 

export const verificarToken = (req, res, next) => { 
    
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) { 
        return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó un token.' });
    } 

    try {
        const decoded = jwt.verify(token, 'gestion_reclamos'); 
        req.usuario = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido.' }); 
    }
};