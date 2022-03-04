"use strict";

const fs = require('fs');
const DAOPersonas = require('./public/javascripts/daoPersonas')
//Require de librerías externas
const path = require("path");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const { user } = require('../AWFinal/config');
/*
const config = require("./config");

const mysql = require("mysql");
const pool = mysql.createPool({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});
*/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
let usuarios = [];
let id = 1;

function cb_getAll(err, result){
	if(err){
		console.log(err);
		res.render("start", {users: usuarios});
	}
	else{
		usuarios = result;
		res.render("start", {users: usuarios});
	}
}

function middle1(req, res, next) {
	console.log(usuarios)
	console.log(usuarios.length);
    if(usuarios.length >= 4){
		res.render("start", {users: usuarios});
	} else {
		next();
	}
}

function middle2(req, res, next) {
    if(req.body.persona.nombre === "Adrian" && req.body.persona.apellidos === "Prieto"){
		req.body.persona = {nombre: "Ese", apellidos: "Tonto que os está explicando"};
	}
	next();
}

app.get("/", function(request, response){
	response.redirect("/start");
});

app.get("/start", function(req,res){
	//let dao = new DAOPersonas(pool);
	//dao.getAll(cb_getAll);
	res.render("start", {users: usuarios});
});

app.post("/anadirPersona", [middle1, middle2], function(req, res){
	let persona = req.body.persona;
	persona.id = id;
	id++;
	usuarios.push(persona);
	res.redirect("start");
	//let dao = new DAOPersonas(pool);
	//dao.anadirPersona(cb_getAll, persona);
});

app.get("*", function(req,res){
	res.render("error", { error: "404" });
});

app.listen(3000, () => {
    console.log("Escuchando en el puerto 3000");
});