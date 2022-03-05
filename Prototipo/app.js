"use strict";

const path = require("path");
const express = require("express");
const app = express();
const multer = require("multer");
const bodyParser = require('body-parser');
const config = require("./config");
const mysql = require("mysql");

const http = require("http");
const hostname = '0.0.0.0';
const port = 3000;
const fs = require("fs");

const DAOPersonas = require('./public/javascripts/daoPersonas')

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

app.get("/", function(request, response){
	response.redirect("/start");
});

app.get("/start", function(req,res){
	let daoP = new DAOPersonas(pool);
	daoP.getPersonas(function (err, us){
		if(err){
			console.log(err);
			res.redirect("start");
		}
		else{
			res.render("start", {users: us});
		}
	});
});

app.post("/anadirPersona", function(req, res){
	let dao = new DAOPersonas(pool);
	let persona = req.body.persona;
	dao.addPersona(persona, function (err, usuario){
		if(err){
			console.log(err);
			res.redirect("start");
		}
		else{
			let dao = DAOPersonas(pool);
			dao.getPersonas(function (err, us){
				if(err){
					console.log(err);
					res.redirect("start");
				}
				else{
					res.render("start", {users: us});
				}
			});
		}
	});
});

app.get("*", function(req,res){
	res.render("error", { error: "404" });
});

const server = http.createServer((req,res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/plain");
	res.end("Hello World!\n");
});

app.listen(3000, () => {
    console.log("Escuchando en el puerto 3000");
});
