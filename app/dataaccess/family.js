const { Family } = require('../models/index')
const Sequelize = require('sequelize')
const op = Sequelize.Op


class Family_ {
    getAll(){
        return new Promise((resolve,reject)=>{
            let data = Family.scope('active','with_OtherData').findAll()
            resolve(data)
        })
    }

    getFamily(idno){
        return new Promise((resolve,reject)=>{
            let data = Family.findOne({where: {id: idno}})
            resolve(data)
        })
    }

    getDetails(idno){
        return new Promise((resolve,reject)=>{
            let data = Family.scope('active','with_OtherData').findOne({where: {id: idno}})
            resolve(data)
        })
    }

    getDetailsViaQrCode(qrcode){
        return new Promise((resolve,reject)=>{
            let data = Family.scope('active','with_OtherData').findAll({where: {QrCode: qrcode}},{limit: 1})
            resolve(data)
        })
    }

    searhFamily(family){
        return new Promise((resolve,reject)=>{
            let data = Family.scope('active','with_OtherData').findAll({where: {family: {[op.like]: `%${family}%`}}})
            resolve(data)
        })
    }
}

module.exports = new Family_()