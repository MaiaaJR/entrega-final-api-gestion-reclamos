import bd from '../config/bd.js'; 

export default class Oficinas { 

    // BUSCAR TODAS LAS OFICINAS
    buscarTodos = async () => {   
        const sql = 'SELECT * FROM oficinas WHERE activo = 1;'; 
        const [result] = await bd.query(sql); 
        return result; 
    }

    
    // BUSCAR OFICINA POR ID
    buscarPorId = async (idOficina) => {  
        const sql = 'SELECT * FROM oficinas WHERE activo = 1 AND idOficina = ?;'; 
        const [result] = await bd.query(sql, [idOficina]); 
        return (result.length > 0) ? result[0] : null; 
    }


    // BUSCAR OFICINA POR RECLAMO TIPO
    buscarPorReclamoTipo = async (idReclamoTipo) => { 
        const sql = 'SELECT * FROM oficinas WHERE idReclamoTipo = ? AND activo = 1'; 
        const [result] = await bd.query(sql, [idReclamoTipo]); 
        return (result.length > 0) ? result[0] : null; 
    }


    // BUSCAR ASIGNACIÓN DE OFICINA A UN USUARIO
    buscarAsignacion = async (idUsuario, idOficina) => { 
        const sql = 'SELECT * FROM usuariosoficinas WHERE idUsuario = ? AND idOficina = ? AND activo = 1'; 
        const [result] = await bd.query(sql, [idUsuario, idOficina]); 
        return (result.length > 0) ? result[0] : null; 
    }


    // CREAR UNA OFICINA
    crear = async ({ nombre, idReclamoTipo }) => { 
        const sql = 'INSERT INTO oficinas (nombre, idReclamoTipo, activo) VALUES (?, ?, 1);'; 
        const [result] = await bd.query(sql, [nombre, idReclamoTipo]); 
    
        if (result.affectedRows === 0) { 
            throw new Error("No se pudo crear la oficina.");
        }
        
        return this.buscarPorId(result.insertId); 
    }


    // MODIFICAR UNA OFICINA 
    modificar = async (idOficina, { nombre }) => { 
        const sql = 'UPDATE oficinas SET nombre = ? WHERE idOficina = ? AND activo = 1'; 
        const [result] = await bd.query(sql, [nombre, idOficina]); 

        if (result.affectedRows === 0) { 
            throw new Error('No se pudo actualizar la oficina.');
        }

        return this.buscarPorId(idOficina);
    }


    // ELIMINAR UNA OFICINA
    eliminar = async (idOficina) => { 
        const sql = 'UPDATE oficinas SET activo = 0 WHERE idOficina = ?;'; 
        const [result] = await bd.query(sql, [idOficina]); 

        if (result.affectedRows === 0) { 
            throw new Error("No se pudo desactivar la oficina.");
        }
        
        return true;
    }


    // ASIGNAR OFICINA A EMPLEADO
    asignarOficinaAEmpleado = async (idUsuario, idOficina) => { 
        const sql = 'INSERT INTO usuariosoficinas (idUsuario, idOficina, Activo) VALUES (?, ?, 1);'; 
        const [result] = await bd.query(sql, [idUsuario, idOficina]); 

        if (result.affectedRows === 0) { 
            throw new Error("No se pudo asignar la oficina al empleado.");
        }
        
        return true; 
    };


    // ELIMINAR ASIGNACIÓN DE EMPLEADO A OFICINA
    eliminarEmpleadoDeOficina = async (idUsuario, idOficina) => { 
        const sql = 'UPDATE usuariosoficinas SET Activo = 0 WHERE idUsuario = ? AND idOficina = ?;'; 
        const [result] = await bd.query(sql, [idUsuario, idOficina]); 
    
        if (result.affectedRows === 0) {
            throw new Error("No se pudo desactivar la asignación del empleado a la oficina.");
        }
        
        return true;
    };    
}