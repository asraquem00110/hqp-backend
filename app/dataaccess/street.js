const { Street, Address } = require('../models/index')
const Sequelize = require('sequelize')
const op = Sequelize.Op
const col = Sequelize.col
const fn = Sequelize.fn

class Street_ {

    getAll(){
        return new Promise((resolve,reject)=>{
            let data = Street.scope("active").findAll()
            resolve(data)
        })
    }

    getPlainList(idno){
        return new Promise((resolve,reject)=>{
            let data = Street.scope("active").findAll({where: {barangayId: idno}})
            resolve(data)
        })
    }

    getStreet(idno){
        return new Promise((resolve,reject)=>{
            let data = Street.findOne({  include: [{model: Address}],where: {id: idno}})
            resolve(data)
        })
    }

    getStreetByBarangay(idno){
        return new Promise((resolve,reject)=>{
            let data = Street.scope("active").findAll(
                {
                    include: [{model: Address}],
                    where: {barangayId: idno}
                }
            )
            resolve(data)
        })
    }

    getSearchStreet(idno,street){
        return new Promise((resolve,reject)=>{
            let data = Street.scope("active").findAll(
                {
                    include: [{model: Address}],
                    where: {barangayId: idno,street:{[op.like]:`%${street}%`}}
                }
            )
            resolve(data)
        })
    }
}

module.exports = new Street_()