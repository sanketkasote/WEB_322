/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: Sanket Kasote             Student ID: 130626153           Date: June 14 2017 *
* ********************************************************************************/

var express = require("express");
var app = express();
var path = require("path");
var DataManager= require('./data-service.js');
var data = new DataManager();

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function(req,res){
  res.sendFile(path.join(__dirname + "/views/home.html"));
});

// setup another route to listen on /about
app.get("/about", function(req,res){
  res.sendFile(path.join(__dirname + "/views/about.html"));
});


app.get("/employees", function(req,res){
    data.getAllEmployees()
        .then((data) => { res.send(data); })
        .catch((reason) => { res.send(reason); });
});

app.get("/employees/:num", function(req,res){
    data.getEmployeeByNum(req.params.num)
        .then((data) => { res.send(data); })
        .catch((reason) => { res.send(reason); });
});

app.get("/managers", function(req,res){
    data.getManagers()
        .then((data) => { res.send(data); })
        .catch((reason) => { res.send(reason); });
});

app.get("/departments", function(req,res){
    data.getDepartments()
        .then((data) => { res.send(data); })
        .catch((reason) => { res.send(reason); });
});

app.use(express.static('public'));

// setup http server to listen on HTTP_PORT

data.initialize()
    .then((response) => {app.listen(HTTP_PORT, onHttpStart)})
    .catch((reason) => { console.log(reason); });
