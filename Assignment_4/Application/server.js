/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: Sanket Kasote             Student ID: 130626153        Date: May 25 2017 *
* ********************************************************************************/

var express = require("express");
var path = require("path");
var DataManager= require('./data-service.js');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

var app = express();
var data = new DataManager();

var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function(req,res){
  res.render("home");
});

// setup another route to listen on /about
app.get("/about", function(req,res){
  res.render("about");
});


app.get("/employees", function(req,res){
    debugger;
    if(typeof req.query.status != "undefined") {
        data.getEmployeesByStatus(req.query.status)
            .then((data) => { res.render("employeeList", { data: data, title: "Employees" }) })
            .catch((reason) => { res.render("employeeList", { data: {}, title: "Employees" }) });
    }

    else if(typeof req.query.department!= "undefined") {
        data.getEmployeesByDepartment(req.query.department)
            .then((data) => { res.render("employeeList", { data: data, title: "Employees" }) })
            .catch((reason) => { res.render("employeeList", { data: {}, title: "Employees" }) });
    }
    else if(typeof req.query.manager!= "undefined") {
        data.getEmployeesByManager(req.query.manager)
            .then((data) => { res.render("employeeList", { data: data, title: "Employees" }) })
            .catch((reason) => { res.render("employeeList", { data: {}, title: "Employees" }) });
    }
    else if(Object.keys(req.query).length == 0) {
        data.getAllEmployees()
            .then((data) => { res.render("employeeList", { data: data, title: "Employees" }) })
            .catch((reason) => { res.render("employeeList", { data: {}, title: "Employees" }) });
    }
});
app.get("/employees/add", function(req,res){
    data.getAllEmployees()
        .then((data) => { res.render("addEmployee", { data: data, title: "Employees" }) })
        .catch((reason) => { res.render("employeeList", { data: {}, title: "Employees" }) });
});
app.post("/employees/add", function(req,res){
    data.addEmployee(req.body)
        .then((data) => { res.redirect('/employees'); })
        .catch((reason) => { res.send(reason); });
});

app.get("/employee/:id", function(req,res){
    data.getEmployeeByNum(req.params.id)
        .then((data) => { res.render("employee", { data: data, title: data.first_name + " " + data.last_name }) })
        .catch((reason) => { res.send(reason); });
});
app.post("/employee/update", function(req,res){
    data.updateEmployee(req.body).then((data) => { res.redirect('/employees'); })
                                 .catch((reason) => { res.send("Hello"); });
});

app.get("/managers", function(req,res){
    data.getManagers()
        .then((data) => { res.render("employeeList", { data: data, title: "Employees (Managers)" }) })
        .catch((reason) => { res.render("employeeList", { data: {}, title: "Employees" }) });
});

app.get("/departments", function(req,res){
    data.getDepartments()
        .then((data) => { res.render("departmentsList", { data: data, title: "Departments" }) })
        .catch((reason) => { res.render("departmentsList", { data: {}, title: "Departments" }) });
});


app.engine(".hbs", exphbs({
         extname: ".hbs"
        ,defaultLayout: 'layout'
        ,helpers: {
            equal: function(lvalue, rvalue, options) {
                if(arguments.length < 3) {
                    throw new Error("Handlebars Helper equal needs two parameters");
                }
                if(lvalue != rvalue) {
                    return options.inverse(this);
                }
                else {
                    return options.fn(this);
                }
            }
        }
    })
);

app.get('*', (req, res) => { res.render('404'); });

app.set("view engine", ".hbs");



// setup http server to listen on HTTP_PORT

data.initialize()
    .then((response) => {app.listen(HTTP_PORT, onHttpStart)})
    .catch((reason) => { console.log(reason); });

