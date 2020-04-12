const { Address } = require('../models/index')

class Address_ {

    getAll() {
        return new Promise((resolve,reject)=>{
            let data = Address.findAll()
            resolve(data)
        })
    }
    getAddress(idno){
        return new Promise((resolve,reject)=>{
            let data = Address.findOne({where: {id: idno}})
            resolve(data)
        })
    }
}

module.exports = new Address_()