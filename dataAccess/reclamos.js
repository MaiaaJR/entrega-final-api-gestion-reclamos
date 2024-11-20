import bd from '../config/bd.js'; 

export default class Reclamos { 

    // BUSCAR TODOS LOS RECLAMOS
    buscarTodos = async (limit = 0, offset = 0, idUsuario) => { 
        let sql = `SELECT r.idReclamo, r.asunto, r.descripcion, r.fechaCreado, r.fechaFinalizado, r.fechaCancelado, 
                        r.idReclamoEstado, re.descripcion AS "Descripción Estado", 
                        r.idReclamoTipo, rt.descripcion AS "Descripción Tipo", 
                        u.nombre AS "Creado por"
                        FROM reclamos AS r
                        INNER JOIN reclamostipo AS rt ON rt.idReclamoTipo = r.idReclamoTipo
                        INNER JOIN reclamosestado AS re ON re.idReclamoEstado = r.idReclamoEstado
                        INNER JOIN usuarios AS u ON u.idUsuario = r.idUsuarioCreador 
                        WHERE r.idUsuarioCreador = ? `; 

        if (limit) { 
            sql += 'LIMIT ? OFFSET ? ';
        }

        const [result] = await bd.query(sql, [idUsuario, limit, offset]); 
        return result; 
    }


    // BUSCAR RECLAMO POR ID
    buscarPorId = async (idReclamo) => { 
        const sql = `SELECT * FROM reclamos WHERE idReclamo = ?`; 
        const [result] = await bd.query(sql, [idReclamo]); 
        return (result.length > 0) ? result[0] : null; 
    }


    // BUSCAR RECLAMOS POR USUARIO
    buscarPorUsuario = async (idUsuario) => {   
        const sql = `SELECT r.idReclamo, r.asunto, r.descripcion, r.fechaCreado, r.fechaFinalizado, r.fechaCancelado, 
                        r.idReclamoEstado, re.descripcion, 
                        r.idReclamoTipo, rt.descripcion
                    FROM reclamos AS r
                    INNER JOIN reclamostipo AS rt ON rt.idReclamoTipo = r.idReclamoTipo
                    INNER JOIN reclamosestado AS re ON re.idReclamoEstado = r.idReclamoEstado
                    WHERE r.idUsuarioCreador = ?`; 
        const [result] = await bd.query(sql, [idUsuario]); 
        return result; 
    }


    // VERIFICAR SI ESTADO ES 1 PARA CANCELAR
    sePuedeCancelar = async (idReclamo) => {    
        const sql = `SELECT * FROM reclamos WHERE idReclamo = ? AND idReclamoEstado = 1`; 
        const [result] = await bd.query(sql, [idReclamo]); 
        return (result.length > 0) ? result[0] : null;
    }


    // CANCELAR RECLAMO
    cancelar = async (idReclamo) => {   
        const sql = `UPDATE reclamos SET idReclamoEstado = 4, fechaCancelado = NOW() WHERE idReclamo = ? AND idReclamoEstado = 1`; 
        const [result] = await bd.query(sql, [idReclamo]); 

        if (result.affectedRows === 0) { 
            return false;
        }

        return true; 
    }


    // CREAR RECLAMO
    crear = async ({ asunto, descripcion, idReclamoTipo, idUsuarioCreador }) => {  
        const sql = `INSERT INTO reclamos (asunto, descripcion, fechaCreado, idReclamoTipo, idReclamoEstado, idUsuarioCreador)
                    VALUES (?, ?, NOW(), ?, 1, ?)`; 
        const [result] = await bd.query(sql, [asunto, descripcion, idReclamoTipo, idUsuarioCreador]); 

        if (result.affectedRows === 0) { 
            return false;
        }

        return this.buscarPorId(result.insertId); 
    }


    // BUSCA RECLAMOS ASIGNADOS A UN EMPLEADO
    buscarPorEmpleado = async (idUsuario) => { 
        const sql = `
            SELECT 
                r.idReclamo,
                r.asunto,
                r.descripcion,
                r.fechaCreado,
                r.idReclamoEstado,
                r.idReclamoTipo,
                u.nombre AS nombreCreador,
                u.apellido AS apellidoCreador
            FROM reclamos r
            JOIN oficinas o ON r.idReclamoTipo = o.idReclamoTipo
            JOIN usuariosoficinas uo ON o.idOficina = uo.idOficina
            JOIN usuarios u ON r.idUsuarioCreador = u.idUsuario
            WHERE uo.idUsuario = ? 
            AND o.activo = 1
            AND uo.activo = 1
            AND r.idReclamoEstado != 4;`; 
    
        const [result] = await bd.query(sql, [idUsuario]);
        return result; 
    }



    // VERIFICAR SI EMPLEADO PERTENECE A LA OFICINA DEL RECLAMO
    verificarEmpleadoOficina = async (idReclamo, idUsuario) => { 
        const sql = `
            SELECT r.idReclamo
            FROM reclamos r
            JOIN oficinas o ON r.idReclamoTipo = o.idReclamoTipo
            JOIN usuariosoficinas uo ON o.idOficina = uo.idOficina
            WHERE r.idReclamo = ? AND uo.idUsuario = ? AND o.activo = 1 AND uo.activo = 1
        `;
        const [result] = await bd.query(sql, [idReclamo, idUsuario]);
        return (result.length > 0);
    }


    // CAMBIAR EL ESTADO DE UN RECLAMO
    cambiarEstado = async (idReclamo, nuevoEstado, idUsuario) => { 
        const sql = `
            UPDATE reclamos r
            JOIN oficinas o ON r.idReclamoTipo = o.idReclamoTipo
            JOIN usuariosoficinas uo ON o.idOficina = uo.idOficina
            SET r.idReclamoEstado = ?,
                r.fechaFinalizado = CASE WHEN ? = 3 THEN NOW() ELSE r.fechaFinalizado END,
                r.idUsuarioFinalizador = CASE WHEN ? = 3 THEN ? ELSE r.idUsuarioFinalizador END
            WHERE r.idReclamo = ?
            AND uo.idUsuario = ?
            AND r.idReclamoEstado IN (1, 2);  -- Solo actualizable si el estado es 'Creado' o 'En proceso'
        `; 
    
        const [result] = await bd.query(sql, [nuevoEstado, nuevoEstado, nuevoEstado, idUsuario, idReclamo, idUsuario]); 
    
        if (result.affectedRows === 0) { 
            return false; 
        }
    
        return true; 
    }


    // BUSCAR INFORMACIÓN DEL CLIENTE POR RECLAMO
    async buscarInformacionClientePorReclamo(idReclamo) { 
        const sql = `
                SELECT u.nombre AS nombreCompleto, u.correoElectronico
                FROM reclamos r
                JOIN usuarios u ON r.idUsuarioCreador = u.idUsuario
                WHERE r.idReclamo = ?;`; 

        const [result] = await bd.query(sql, [idReclamo]);
        return result[0]; 
    }


    // BUSCAR DATOS PARA REPORTE EN PDF
    buscarDatosReportePdf = async () => { 
        const sql = 'CALL datosPDF()'; 

        const [result] = await bd.query(sql); 
        
        const datosReporte = { 
            reclamosTotales: result[0][0].reclamosTotales,
            reclamosNoFinalizados: result[0][0].reclamosNoFinalizados,
            reclamosFinalizados: result[0][0].reclamosFinalizados,
            descripcionTipoReclamoFrecuente: result[0][0].descripcionTipoReclamoFrecuente,
            cantidadTipoReclamoFrecuente: result[0][0].cantidadTipoReclamoFrecuente
        }

        return datosReporte; 
    }


    // BUSCAR DATOS PARA REPORTE EN CSV
    buscarDatosReporteCsv = async () => { 
        const sql = `SELECT r.idReclamo as 'reclamo', rt.descripcion as 'tipo', re.descripcion AS 'estado',
        DATE_FORMAT(r.fechaCreado, '%Y-%m-%d %H:%i:%s') AS 'fechaCreado', CONCAT(u.nombre, ' ', u.apellido) AS 'cliente'
        FROM reclamos AS r 
        INNER JOIN reclamosTipo AS rt ON rt.idReclamoTipo = r.idReclamoTipo 
        INNER JOIN reclamosEstado AS re ON re.idReclamoEstado = r.idReclamoEstado 
        INNER JOIN usuarios AS u ON u.idUsuario = r.idUsuarioCreador;`; 

        const [result] = await bd.query(sql); 
        return result;
    };


    // OBTENER ESTADÍSTICAS DE RECLAMOS
    obtenerEstadisticasReclamos = async () => { 
        const [result] = await bd.query('CALL obtenerEstadisticasReclamos()'); 
        return result[0];
    }


    // OBTENER ESTADÍSTICAS DE USUARIOS POR OFICINA
    obtenerEstadisticasUsuariosPorOficina = async () => { 
        const [result] = await bd.query('CALL obtenerEstadisticasUsuariosPorOficina()'); 
        return result[0]; 
    }   
};