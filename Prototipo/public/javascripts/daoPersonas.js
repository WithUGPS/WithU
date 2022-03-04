"use strict";

class DAOPersonas {
	constructor(pool) {
		this._pool = pool;
	}
	
	getAll(callback) {
		this._pool.getConnection(function(err, connection) {
			if (err) {
				callback("Error de acceso a la BD");
			}
			else {
				connection.query("SELECT * " +
								 "FROM Persona p" +
								 "ORDER BY p.id" ,
					function(err, rows) {
						connection.release(); // devolver al pool la conexión
						if (err) {
                            callback("Error con la Query");
						}
						else {
                            let personas = Array.from(new Set(
                                rows.map(t => t.id))).map(id => {
                                    return {
                                        id: id,
                                        nombre: rows.find(t => t.id === id).nombre,
                                        apellidos: rows.find(t => t.id === id).apellidos
                                    }
                                }
                            );
							callback(null, personas);
						}
					}
				);
			}
		});
	}
}
module.exports = DAOPersonas;