import bd from '../config/bd.js'; 

export default class Usuarios { 

    // BUSCAR USUARIO POR CORREO ELECTRONICO
    buscar = async (correoElectronico) => { 
        const sql = `SELECT u.idUsuario, u.nombre, u.apellido, u.correoElectronico, u.contrasenia, u.idUsuarioTipo
            FROM usuarios AS u
            WHERE u.correoElectronico = ? 
                AND u.activo = 1;`; 
        const [result] = await bd.query(sql, [correoElectronico]); 
        return result[0]; 
    }

    
    // BUSCAR USUARIO POR ID
    buscarPorId = async (idUsuario) => { 
        const sql = `SELECT CONCAT(u.nombre, ' ', u.apellido) as usuario, u.idUsuarioTipo, u.idUsuario
            FROM usuarios AS u
            WHERE u.idUsuario = ?
                AND u.activo = 1;`; 
        const [result] = await bd.query(sql, [idUsuario]); 

        return (result.length > 0) ? result[0] : null; 
    }


    // BUSCAR TODOS LOS USUARIOS DE TIPO EMPLEADO
    buscarTodosEmpleados = async () => {  
        const sql = `SELECT * FROM usuarios WHERE idUsuarioTipo = 2 AND activo = 1;`; 
        const [result] = await bd.query(sql); 
        return result; 
    }


    // MODIFICAR USUARIO 
    modificar = async (idUsuario, datos) => {  
        const sql = `UPDATE usuarios SET ? WHERE idUsuario = ? AND activo = 1;`; 
        const [result] = await bd.query(sql, [datos, idUsuario]); 
        
        if (result.affectedRows === 0) { 
            return false;
        }
        
        return true; 
    }


    // CREAR UN USUARIO
    crear = async ({ nombre, apellido, correoElectronico, contrasenia, idUsuarioTipo }) => { 
        const sql = `INSERT INTO usuarios (nombre, apellido, correoElectronico, contrasenia, idUsuarioTipo, activo)
                     VALUES (?, ?, ?, ?, ?, 1);`; 
        const [result] = await bd.query(sql, [nombre, apellido, correoElectronico, contrasenia, idUsuarioTipo]); 

        if (result.affectedRows === 0) { 
            return false;
        }

        return this.buscarPorId(result.insertId); 
    }


    // DESACTIVAR USUARIO
    eliminar = async (idUsuario) => { 
        const sql = 'UPDATE usuarios SET activo = 0 WHERE idUsuario = ?'; 
        const [result] = await bd.query(sql, [idUsuario]); 

        if (result.affectedRows === 0) { 
            return false;
        }

        return true; 
    }
}