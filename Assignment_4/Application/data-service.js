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
        let employees = [];
        employees = this.dataEmp.filter((employee) => { return employee.status == status; });
        if(typeof employees != "undefined") {
            resolve(employees);
        }
        else {
            reject({ message: "uh oh something happened!"});
        }
    });
}
DataManager.prototype.getEmployeesByDepartment = function(department)
{
    return new Promise((resolve, reject) => {
        let employees = this.dataEmp.filter((employee) => { return employee.department == department });
        if(typeof employees != "undefined") {
            resolve(employees);
        }
            else {
            reject({ message: "uh oh something happened!"});
        }
    });
}
DataManager.prototype.getEmployeesByManager = function(manager)
{
    let employees = this.dataEmp.filter((employee) => {
        return employee.employeeManagerNum == manager;
    });
    return new Promise((resolve, reject) => {
        if(typeof employees != "undefined") {
            resolve(employees);
        
        }
        else {
           reject({ message: "uh oh something happened!"});
        }
    }); 
}
DataManager.prototype.getEmployeeByNum = function(num)
{
    return new Promise((resolve, reject) => {
        let employee = this.dataEmp.find((employee) => {
            return employee.employeeNum == num;
        });
        if(typeof employee != "undefined") {
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
DataManager.prototype.updateEmployee = function(employee)
{
    return new Promise((resolve, reject) => {
        let empIdx = this.dataEmp.findIndex((emp) => { return emp.employeeNum == employee.employeeNum});
        if(empIdx !== -1) {
            employee.isManager = employee.isManager == "true";
            Object.assign(this.dataEmp[empIdx], employee);
            resolve(this.dataEmp[empIdx]);
        }
        else {
            reject("Employee not found");
        }
    });
}
DataManager.prototype.addEmployee = function(employee)
{
    return new Promise((resolve, reject) => {
        employee.employeeNum = this.dataEmp.length + 1;
        this.dataEmp.push(employee);
        resolve(employee);
    });
}
module.exports = DataManager;
