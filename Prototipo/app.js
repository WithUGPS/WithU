"use strict";

//const fs = require('fs');
const DAOPersonas = require('./public/javascripts/daoPersonas')

const path = require("path");
const express = require("express");
const app = express();

//const bodyParser = require("body-parser");

const config = require("./config");

const mysql = require("mysql");
const pool = mysql.createPool({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
//app.use(bodyParser.urlencoded({ extended: true }));

//let usuarios = [];
//let id = 1;

function cb_getAll(err, us){
	if(err){
		console.log(err);
		res.redirect("start");
	}
	else{
		res.render("start", {users: us});
	}
}

function cb_addPersona(err, usuario){
	if(err){
		console.log(err);
		res.redirect("start");
	}
	else{
		let dao = DAOPersonas(pool);
		dao.getPersonas(cb_getAll);
	}
}

app.get("/", function(request, response){
	response.redirect("/start");
});

app.get("/start", function(req,res){
	let daoP = new DAOPersonas(pool);
	daoP.getAll(cb_getAll);
});

app.post("/anadirPersona", function(req, res){
	let persona = req.body.persona;
	let dao = new DAOPersonas(pool);
	dao.addPersona(persona, cb_addPersona);
});

app.get("*", function(req,res){
	res.render("error", { error: "404" });
});

app.listen(3000, () => {
    console.log("Escuchando en el puerto 3000");
});