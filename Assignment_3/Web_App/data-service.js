function DataManager(){
    this.dataEmp = new Array();
    this.dataDept = new Array();
}

DataManager.prototype.initialize = function()
{
    var fs = require('fs');
    console.log("loading file");
    let promise = new Promise((resolve, reject) => {
        fs.readFile(__dirname + "/data/departments.json",
            (err, contents) => {
                if(err) {
                    reject(err);
                }
                else {
                    this.dataDept = JSON.parse(contents);
                    resolve("success");
                }
        });

        fs.readFile(__dirname + "/data/employees.json",
            (err, contents) => {
                if(err) {
                    reject(err);
                }
                else {
                    this.dataEmp = JSON.parse(contents);
                    resolve("success");
                }
        });
    });
    return promise;
}
DataManager.prototype.getAllEmployees = function()
{
    return new Promise((resolve, reject) => {
        if(this.dataEmp) {
            resolve(this.dataEmp);
        }
        else {
            reject({ message: "uh oh something happened!"});
        }
    });
}
DataManager.prototype.getEmployeesByStatus = function(status)
{
    return new Promise((resolve, reject) => {
        if(this.dataEmp.find((employee) => { return employee.status == status; }) != "undefined") {
            resolve(employee);
        }
        else {
            reject({ message: "uh oh something happened!"});
        }
    });
}
DataManager.prototype.getEmployeesByDepartment = function(department)
{
    return new Promise((resolve, reject) => {
        if(this.dataEmp.find((employee) => { return employee.department == department }) != "undefined") {
            resolve(employee);
        }
            else {
            reject({ message: "uh oh something happened!"});
        }
    });
}
DataManager.prototype.getEmployeesByManager = function(manager)
{
    let employee = this.dataEmp.find((employee) => {
        return employee.employeeManagerNum == manager;
    });
    return new Promise((resolve, reject) => {
        if(employee != "undefined") {
            resolve(employee);
        
        }
        else {
           reject({ message: "uh oh something happened!"});
        }
    }); 
}
DataManager.prototype.getEmployeeByNum = function(num)
{
    let employee = this.dataEmp.find((employee) => {
        return employee.employeeNum == num;
    });
    return new Promise((resolve, reject) => {
        if(employee != "undefined") {
            resolve(employee);
        }
        else {
           reject({ message: "uh oh something happened!"});
        }
    });
}
DataManager.prototype.getManagers = function()
{
    let managers = this.dataEmp.filter((employee) => { return employee.isManager; });
    return new Promise((resolve, reject) => {
        if(managers){
            resolve(managers);
        }
        else {
           reject({ message: "uh oh something happened!"});
        }
    });
}
DataManager.prototype.getDepartments = function()
{
    return new Promise((resolve, reject) => {
        if(this.dataDept) {
            resolve(this.dataDept);
        }
        else {
           reject({ message: "uh oh something happened!"});
        }
    });
}

module.exports = DataManager;
