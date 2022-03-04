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
				con.query("INSERT INTO Persona(Nombre, Apellido) VALUES (?, ?)" , [persona.nombre, persona.apellidos],
					function(err, rows) {
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
								 "ORDER BY p.id" ,
					function(err, rows) {
						con.release();
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