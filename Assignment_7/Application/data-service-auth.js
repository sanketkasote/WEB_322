const mongoose = require('mongoose');
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
                users = users.filter((user) => user.password == data.password);
                console.log(users);
                if(users.length > 0) {
                    resolve();
                }
                else {
                    reject("incorrect password for user: " + data.user);
                }
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
}

module.exports = UserManager;
