"use strict";

class DAOPersonas {
	constructor(pool) {
		this._pool = pool;
	}

	addPersona(persona, callback){
		this._pool.getConnection(function(err, con) {
			if (err) {
				callback("No se ha podido acceder a la base de datos");
			}
			else {
				con.query("INSERT INTO Persona(Nombre, Apellidos) VALUES (?, ?)" , [persona.nombre, persona.apellidos],
					function(err, result) {
						con.release();
						if (err) {
                            callback("Error con la Query");
						}
						else {
                            persona.id = result.insertId;
							callback(null, persona);
						}
					}
				);
			}
		});
	}

	getPersonas(callback) {
		this._pool.getConnection(function(err, con) {
			if (err) {
				callback("No se ha podido acceder a la base de datos");
			}
			else {
				con.query("SELECT * " +
								 "FROM Persona p" +
								 " ORDER BY p.id" ,
					function(err, rows) {
						con.release();
						if (err) {
                            callback("Error con la Query en leer");
						}
						else {
                            let personas = Array.from(new Set(
                                rows.map(t => t.id))).map(id => {
                                    return {
                                        id: id,
                                        Nombre: rows.find(t => t.id === id).Nombre,
                                        Apellidos: rows.find(t => t.id === id).Apellidos
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
