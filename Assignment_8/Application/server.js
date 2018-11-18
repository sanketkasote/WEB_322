/*********************************************************************************
* WEB322 – Assignment 08
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: Sanket Kasote             Student ID: 130626153      Date: August 9 2017 *
* ********************************************************************************/

const express = require("express");
const path = require("path");
const DataManager= require('./data-service.js');
const CommentManager = require('./data-service-comments.js');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const clientSessions = require("client-sessions");
const UserManager = require("./data-service-auth.js");

var app = express();
var data = new DataManager();

var HTTP_PORT = process.env.PORT || 8080;
if(process.env.DEV) {
    var MONGO_URL = "mongodb://mongodb/"
}
else {
    var MONGO_URL = "mongodb://mhong17:itsalex1@ds155192.mlab.com:55192/web322_a6"
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(
    clientSessions({
        cookieName: 'session',
        secret: '837518905728219304652',
        duration: 24 * 60 * 60 * 1000,
        cookie: {
            path: "/",
            ephemeral: true,
            httpOnly: true,
            secure: false
        }
    })
);
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Middleware 

const ensureLogin = (req, res, next) => {
    console.log('ensureLogin');
    if(req.session.user) {
        next();
    }
    else {
        res.redirect("/login");
    }
};

app.use("/employees", ensureLogin)
app.use("/employee/:id", ensureLogin)
app.use("/employees/add", ensureLogin)
app.use("/employees/add", ensureLogin)
app.use("/employee/update", ensureLogin)
app.use("/managers", ensureLogin)
app.use("/departments", ensureLogin)
app.use("/department/:id", ensureLogin)
app.use("/employee/delete/:id", ensureLogin)

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function(req,res){
  res.render("home");
});

// setup another route to listen on /about
app.get("/about", function(req,res){
    CommentManager.getAllComments().then((data) => res.render("about", { comments: data }))
                                   .catch((err) => { console.log(err); res.render("about", { comments: [] }); });
});
app.post("/about/addComment", (req, res) => {
    CommentManager.addComment(req.body).then(() => res.redirect("/about"))
                                       .catch((err) => {
                                            console.log(err);
                                            res.redirect("/about");
                                        });
});
app.post("/about/addReply", (req, res) => {
    CommentManager.addReply(req.body).then(() => res.redirect("/about"))
                                       .catch((err) => {
                                            console.log(err);
                                            res.redirect("/about");
                                        });
});


app.get("/employees", function(req,res){
    console.log(req.query);
    if(typeof req.query.status != "undefined") {
        data.getEmployeesByStatus(req.query.status)
            .then((data) => { res.render("employeeList", { data: data, title: "Employees - by status" }) })
            .catch((reason) => { res.render("employeeList", { data: {}, title: "Employees" }) });
    }

    else if(typeof req.query.department != "undefined") {
        data.getEmployeesByDepartment(req.query.department)
            .then((data) => { res.render("employeeList", { data: data, title: "Employees - by department" }) })
            .catch((reason) => { res.render("employeeList", { data: {}, title: "Employees" }) });
    }
    else if(typeof req.query.manager != "undefined") {
        data.getEmployeesByManager(req.query.manager)
            .then((data) => { res.render("employeeList", { data: data, title: "Managers" }) })
            .catch((reason) => { res.render("employeeList", { data: {}, title: "Employees" }) });
    }
    else {
        data.getAllEmployees()
            .then((data) => { res.render("employeeList", { data: data, title: "Employees" }) })
            .catch((reason) => { res.render("employeeList", { data: {}, title: "Employees" }) });
    }
});

app.get("/employee/:id", function(req,res){
    let departments = [];
    data.getDepartments().then((depts) => departments = depts)
                         .catch((reason) => { console.log(reason); res.redirect("/employees"); });
    data.getEmployeeByNum(req.params.id)
        .then((data) => { console.log(data); res.render("employee", { data: data, title: "Alex Díaz", departments: departments }); })
        .catch((reason) => { res.send(reason); });
});

app.get("/employees/add", function(req,res){
    data.getDepartments().then((data) => {  res.render("addEmployee", { departments: data, title: "Add Employee" }) })
                         .catch((reason) => { console.log(reason); res.render("addEmployee", { data: {}, title: "Add Employee" }) });
});

app.post("/employees/add", function(req,res){
    data.addEmployee(req.body)
        .then((data) => { res.redirect('/employees'); })
        .catch((reason) => { res.send(reason); });
});

app.post("/employee/update", function(req,res){
    data.updateEmployee(req.body).then((data) => { res.redirect('/employees'); })
                                 .catch((reason) => { console.log(reason); res.redirect('/employees');  });
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
app.get("/departments/add", (req, res) => {
    res.render("addDepartment", { title: "Add Department" });
}); 
app.post("/departments/add", (req, res) => {
    data.addDepartment(req.body).then((department) => { res.render("department", { data: department}); })
                                       .catch((reason) => { console.log(reason); res.redirect("/departments"); });
});
app.post("/departments/update", (req, res) => {
    data.updateDepartment(req.body).then((department) => { res.redirect("/departments"); })
                                   .catch((reason) => { console.log(reason); res.redirect("/departments"); });
});

app.get("/department/:id", (req, res) => {
    data.getDepartmentById(req.params.id).then((department) => { res.render("department", { data: department }); })
                                        .catch((reason) => { console.log(reason); res.redirect("/"); });
});

app.get("/employee/delete/:id", (req, res) => {
    console.log("deleting");
    data.deleteEmployeeByNum(req.params.id).then((data) => { res.redirect("/employees"); })
                                           .catch((reason) => { console.log(reason); res.redirect("/employees"); });
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

app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/login", (req, res) => {
    UserManager.checkUser(req.body)
    .then(() => {
        console.log("logged in");
        req.session.user = req.body.user;
        res.redirect("/employees");
    })
    .catch((err) => {
        console.log("err: "+ err);
        res.render("login", { errorMessage: err, user: req.body.user });
    });
});
app.post("/register", (req, res) => {
    console.log(req.body);
    UserManager.registerUser(req.body)
    .then((user) => {
        res.render("register", { successMessage: "User created", user: user });
    })
    .catch((err) => {
        res.render("register", { errorMessage: err, user: req.body.user });
    });
});

app.post('/api/updatePassword', (req, res) => {
    UserManager.checkUser({ user: req.body.user, password: req.body.currentPassword})
               .then(() => {
                    UserManager.updatePassword(req.body)
                               .then(() => res.json({ successMessage: "Password successfully changed for user: " + req.body.user}))
                               .catch((err) => res.json({ errorMessage: err }));
                })
               .catch((err) => res.json({ errorMessage: err }));
});

app.get('*', (req, res) => { res.render('404'); });

app.set("view engine", ".hbs");



// setup http server to listen on HTTP_PORT

data.initialize()
    .then(() => UserManager.initialize(MONGO_URL))
    .then(() => CommentManager.initialize(MONGO_URL))
    .then((response) => {app.listen(HTTP_PORT, onHttpStart)})
    .catch((reason) => { console.log(reason); });

