const validator = require('../helper/validator')
const { sequelize, User } = require('../models/index')
const UserData = require('../dataaccess/user')
const bcrypt = require('bcrypt')
const saltRounds = 10
const controller = {}

controller.save = (req,res,next)=>{
    const rules = {
        "email": "required|email|unique:users,email",
        "fullname": "required|string",
        "password": "required|string|min:6|confirmed|strict",
    }

    validator(req.body,rules,{}).then(async (response)=>{
        if(!response.status){
           res.json(response.err)
        }else{
        const { email , fullname , password } = req.body
        const newuser = {
            email: email,
            fullname: fullname,
            password: bcrypt.hashSync(password, saltRounds),
        }
        const user = await User.create(newuser)
        res.json(user)
        }
    })
    .catch(err=>console.log(err))
    return
}

controller.changepass = (req,res,next)=>{
    const idno = req.params.idno
    const rules = {
        "password": "required|string|min:6|confirmed|strict",
    }

    validator(req.body,rules,{}).then(async (response)=>{
        if(!response.status){
           res.json(response.err)
        }else{
            const { password } = req.body
            const newpass = {
                password: bcrypt.hashSync(password, saltRounds),
            }

            let updateresult = await User.update(newpass,{where: {id: idno}})
            if(updateresult == 0) res.status(401).json("no record found")  
            let userdata = await UserData.getUser(idno)   
            res.json(userdata)
        }
    })
    .catch(err=>console.log(err))
}

controller.getlist = (req,res,next)=>{
    UserData.getAll().then(result=>res.json({data: result})).catch(err=>res.json(err))
}

controller.getUser = (req,res,next)=>{
    const user = req.params.user
    UserData.searchUser(user).then(result=>res.json({data: result})).catch(err=>res.json(err))  
}

controller.update = (req,res,next)=>{
    const idno = req.params.idno
    const rules = {
        "fullname": "required|string",
    }

    const { email , fullname , oldemail } = req.body

    if(email != oldemail){
        rules.email = "required|email|unique:users,email"
    }

    validator(req.body,rules,{}).then(async (response)=>{
        if(!response.status){
           res.json(response.err)
        }else{
            
            const newuser = {
                email: email,
                fullname: fullname,
            }

            let updateresult = await User.update(newuser,{where: {id: idno}})
            if(updateresult == 0) res.status(401).json("no record found")    
            let userdata = await UserData.getUser(idno)   
            res.json(userdata)
        }
    })
    .catch(err=>console.log(err))
}

controller.archive = async (req,res,next)=>{
    const idno = req.params.idno
    let archiveres = await User.update({archive: 1},{where: {id: idno}})
    if(!archiveres)res.status(500).json("something went wrong")
    if(archiveres) res.json("archived")
}

controller.remove = (req,res,next)=>{
    const idno = req.params.idno
    User.destroy({where: {id: idno}}).then(result=>res.json("deleted")).catch(err=>console.log(err))
}

controller.getDetails = async (req,res,next)=>{
    const idno = req.params.idno
    const data = await UserData.getUser(idno)
    res.json({data: data})
}



module.exports = controller