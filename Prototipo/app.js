"use strict";

const DAOPersonas = require('./public/javascripts/daoPersonas')
const path = require("path");
const express = require("express");
const app = express();
const multer = require("multer");
const bodyParser = require('body-parser');
const config = require("./config");
const mysql = require("mysql");

const pool = mysql.createPool({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});
const multerFactory = multer({ storage: multer.memoryStorage() });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

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
	daoP.getPersonas(cb_getAll);
});

app.post("/anadirPersona", [middle1, middle2], function(req, res){
	let dao = new DAOPersonas(pool);
	let persona = req.body.persona;
	dao.addPersona(persona, cb_addPersona);
});

app.get("*", function(req,res){
	res.render("error", { error: "404" });
});

app.listen(3000, () => {
    console.log("Escuchando en el puerto 3000");
});