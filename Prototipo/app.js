"use strict";

const fs = require('fs');

//Require de librerías externas
const path = require("path");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
let usuarios = [];
let usuario = {ID: "1", Nombre: "Adri", Apellidos: "Prieto Campo"};
let id = 1;
usuarios.push(usuario);

app.get("/", function(request, response){
	response.redirect("/start");
});

app.get("/start", function(req,res){
	let usuario2 = {ID: id++, Nombre: "Adri", Apellidos: "Prieto Campo"};
	usuarios.push(usuario2);
	res.render("start", {users: usuarios});
});

app.get("*", function(req,res){
	res.render("error", { error: "404" });
});

app.listen(3000, () => {
    console.log("Escuchando en el puerto 3000");
});