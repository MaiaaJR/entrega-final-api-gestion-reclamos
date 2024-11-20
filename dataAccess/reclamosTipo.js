import bd from '../config/bd.js'; 

export default class ReclamosTipo { 

    // BUSCAR TODOS LOS RECLAMOS TIPO
    buscarTodos = async () => {    
        const sql = 'SELECT * FROM reclamostipo WHERE activo = 1'; 
        const [result] = await bd.query(sql); 
        return result;
    }


    // BUSCAR RECLAMO TIPO POR ID
    buscarPorId = async (idReclamoTipo) => {  
        const sql = 'SELECT * FROM reclamostipo WHERE idReclamoTipo = ? AND activo = 1'; 
        const [result] = await bd.query(sql, [idReclamoTipo]); 
        return (result.length > 0) ? result[0] : null; 
    }


    // CREAR UN RECLAMO TIPO
    crear = async ({ descripcion }) => { 
        const sql = 'INSERT INTO reclamostipo (descripcion, activo) VALUES (?, 1)'; 
        const [result] = await bd.query(sql, [descripcion]); 

        if (result.affectedRows === 0) { 
            return false;
        }

        return this.buscarPorId(result.insertId); 
    }


    // MODIFICAR RECLAMO TIPO POR ID
    modificar = async (idReclamoTipo, datos) => {  
        const sql = 'UPDATE reclamostipo SET ? WHERE idReclamoTipo = ? AND activo = 1';
        const [result] = await bd.query(sql, [datos, idReclamoTipo]); 

        if (result.affectedRows === 0) {
            return false;
        }

        return true; 
    }


    // ELIMINAR RECLAMO TIPO POR ID
    eliminar = async (idReclamoTipo) => { 
        const sql = 'UPDATE reclamostipo SET activo = 0 WHERE idReclamoTipo = ?'; 
        const [result] = await bd.query(sql, [idReclamoTipo]); 

        if (result.affectedRows === 0) { 
            return false;
        }

        return true;
    }
}