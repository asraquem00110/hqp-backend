const { Member } = require('../models/index')

class Member_ {

    getMemberData(idno){
        return new Promise((resolve,reject)=>{
            let data = Member.scope("active").findByPk(idno)
            resolve(data)
        })
    }
}

module.exports = new Member_()