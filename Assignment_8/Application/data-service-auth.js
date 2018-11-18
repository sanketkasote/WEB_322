const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let User;

const userSchema = mongoose.Schema({
    user:{ type: String, unique: true },
    password: String
});

class UserManager {
    static initialize(dbUrl) {
        let db = mongoose.createConnection(dbUrl);
        return new Promise((resolve, reject) => {
            db.on('error', (err) => {
                reject(err);
            });
            db.once('open', () => {
                User = db.model("users", userSchema);
                resolve();
            });
        });
    }
    static registerUser(data) {
        return new Promise((resolve, reject) => {
            if(data.password == data.password2) {
                bcrypt.hash(data.password, 1, (err, hash) => {
                    data.password = hash;
                    let newUser = new User(data);
                    console.log(newUser);
                    newUser.save((err) => {
                        if(err) {
                            if(err.code == 11000) {
                                reject("Username already taken");
                            }
                            else {
                                reject("There was an error: "+err);
                            }
                        }
                        else {
                            resolve(newUser);
                        }
                    });
                });
            }
            else {
                reject("passwords don't match");
            }
        });
    }
    static checkUser(data) {
        return new Promise((resolve, reject) => {
            let users = User.find({ user: data.user }).then((users) => {
                if(users.length == 0) {
                    reject('unable to find user: ' + data.user);
                }
                bcrypt.compare(data.password, users[0].password, (err, res) => {
                    console.log(users);
                    if(res) {
                        resolve();
                    }
                    else {
                        reject("incorrect password for user: " + data.user);
                    }
                });
            })
            .catch((err) => reject("unable to find user: " + data.user));
        });
    }
    static getAllUsers() {
        return User.find().exec();
    }
    static addReply(data) {
        data.repliedDate = Date.now();
        return User.update({ _id: data.user_id }, { $addToSet: { replies: data } }).exec();
    }
    static updatePassword(data) {
        return new Promise((resolve, reject) => {
            if(data.password == data.password2) {
                bcrypt.hash(data.password, 1, (hErr, hash) =>  {
                    User.update({ user: data.user},
                                { $set: { password: hash } },
                                { multi: false }).exec()
                                                 .then(resolve)
                                                 .catch((err) => { console.log(err);
                                                                   reject('There was an error updating the password for ' + data.user)});
                });
            }
            else {
                reject('Passwords do not match');
            }
        });
    }
}

module.exports = UserManager;
