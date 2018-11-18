const Sequelize = require("sequelize");

console.log(process.env);
let sequelize = new Sequelize(process.env.DATABASE_URL);

var Employee = sequelize.define('Employee', {
      employeeNum: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true }
    , firstName: Sequelize.STRING
    , last_name: Sequelize.STRING
    , email: Sequelize.STRING
    , SSN: Sequelize.STRING
    , addressStreet: Sequelize.STRING
    , addressCity: Sequelize.STRING 
    , addressState: Sequelize.STRING
    , addressPostal: Sequelize.STRING
    , maritalStatus: Sequelize.STRING
    , isManager: Sequelize.BOOLEAN
    , employeeManagerNum: Sequelize.INTEGER
    , status: Sequelize.STRING
    , hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
      departmentId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }
    , departmentName: Sequelize.STRING
});

Employee.belongsTo(Department, { foreignKey: 'department' });

function DataManager(){
    this.dataEmp = new Array();
    this.dataDept = new Array();
}

DataManager.prototype.initialize = function()
{
    let promise = new Promise((resolve, reject) => {
        sequelize.sync().then(resolve)
                        .catch(reject);
    });
    return promise;
};

DataManager.prototype.getAllEmployees = function()
{
    return new Promise((resolve, reject) => {
        Employee.findAll({
            include: {
                model: Department,
                required: true
            }
        }).then(resolve)
         .catch(reject);
    });
};

DataManager.prototype.getEmployeesByStatus = function(status)
{
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                status: status
            },
            include: {
                model: Department,
                required: true
            }
        }).then(resolve)
          .catch(reject);
    });
};

DataManager.prototype.getEmployeesByDepartment = function(department)
{
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                department: department 
            },
            include: {
                model: Department,
                required: true
            }
        }).then(resolve)
          .catch(reject);
    });
};

DataManager.prototype.getEmployeesByManager = function(manager)
{
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                manager: manager 
            },
            include: {
                model: Department,
                required: true
            }
        }).then(resolve)
          .catch(reject);
    });
};

DataManager.prototype.getEmployeeByNum = function(num)
{
    return new Promise((resolve, reject) => {
        Employee.find({
            where: {
                employeeNum: num 
            },
            include: {
                model: Department,
                required: true
            }
        }).then((employee) => { resolve(employee.get({ plain: true})); })
          .catch(reject);
    });
};

DataManager.prototype.getManagers = function()
{
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                isManager: true
            },
            include: {
                model: Department,
                required: true
            }
        }).then(resolve)
          .catch(reject);
    });
};

DataManager.prototype.getDepartments = function()
{
    return new Promise((resolve, reject) => {
        Department.findAll().then(resolve)
                            .catch(reject);
    });
};

DataManager.prototype.updateEmployee = function(employee)
{
    debugger;
    employee.isManager = (employee.isManager == "true")?true:false;
    for(property in employee) {
        if(employee[property] == "") {
            employee[property] = null;
        }
    }
    return new Promise((resolve, reject) => {
        Employee.find({ where: { employeeNum: employee.employeeNum } })
                .then((record) => { record.update(employee); resolve(record); })
                .catch(reject);
    });
};

DataManager.prototype.addEmployee = function(employee)
{
    employee.isManager = (employee.isManager == "true")?true:false;
    for(property in employee) {
        console.log(employee[property]);
        if(!employee[property]) {
            employee[property] = null;
        }
    }
    return new Promise((resolve, reject) => {
        Employee.create(employee).then(resolve)
                                 .catch(reject);
    });
};

DataManager.prototype.deleteEmployeeByNum = function(id) 
{
    return new Promise((resolve, reject) => {
        Employee.find({ where: { employeeNum: id } }).then((employee) => { employee.destroy().then(resolve).catch(reject); })
                                            .catch(reject)
    });
};

DataManager.prototype.addDepartment = function(department)
{
    for(property in department) {
        if(!department[property]) {
            department[property] = null;
        }
    }
    return new Promise((resolve, reject) => {
        Department.create(department).then(resolve)
                                     .catch(reject);
    });
};

DataManager.prototype.updateDepartment = function(department) {
    for(property in department) {
        if(property == "") {
            property = null;
        }
    }
    return new Promise((resolve, reject) => {
        Department.find({ where: { departmentId: department.departmentId } })
                  .then((record) => { record.update(department); resolve(record); })
                  .catch(reject);
    });
};

DataManager.prototype.getDepartmentById = function(id)
{
    return new Promise((resolve, reject) => {
        Department.find({ where: { departmentId: id } })
                  .then((record) => { resolve(record.get({ plain: true})); })
                  .catch(reject);
    });
}


module.exports = DataManager;
