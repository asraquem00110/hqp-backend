const { Barangay, Street, Address, Family } = require('../models/index')
const Sequelize = require('sequelize')
const op = Sequelize.Op
const col = Sequelize.col
const fn = Sequelize.fn
const literal = Sequelize.literal

class Barangay_ {

    getAll(){
        return new Promise((resolve,reject)=>{
            let data = Barangay.scope('active','withStreet_Address').findAll(
                {
                    order: ['barangay']
                })
            resolve(data)
        })
    }

    getPlainList(){
        return new Promise((resolve,reject)=>{
            let data = Barangay.findAll({order: ['barangay']})
            resolve(data)
        })
    }

    getBarangay(idno){
        return new Promise((resolve,reject)=>{
            // scope with parameters/function
            // let data = Barangay.scope('withStreet_Address',{method: ['findbyId', idno]}).findOne()
            
            let data = Barangay.scope('withStreet_Address').findOne(
                {
                    where: {id: idno}
                }
            )
            resolve(data)
        })
    }

    getSearchbarangay(barangay){
        return new Promise((resolve,reject)=>{
            // scope with parameters/function
            // let data = Barangay.scope('withStreet_Address',{method: ['findbyId', idno]}).findOne()
            
            let data = Barangay.scope('active','withStreet_Address').findAll(
                {
                    where: {barangay: {
                        [op.like]:  `%${barangay}%`,
                    }}
                }
            )
            resolve(data)
        })
    }
}

module.exports = new Barangay_()