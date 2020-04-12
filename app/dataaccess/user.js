const { User } = require("../models/index")
const Sequelize = require('sequelize')
const op = Sequelize.Op

class User_ {
    getAll() {
        return new Promise((resolve,reject)=>{
            let data = User.scope(["active"]).findAll()
            resolve(data)
        })
    }
    getUser(idno){
        return new Promise((resolve,reject)=>{
            let data = User.scope(["active"]).findOne({where: {id: idno}})
            resolve(data)
        })
    }

    searchUser(user){
        return new Promise((resolve,reject)=>{
            let data = User.scope(["active"]).findAll({where: {fullname: {[op.like]: `%${user}%`}}})
            resolve(data)
        })
    }
}

module.exports = new User_()