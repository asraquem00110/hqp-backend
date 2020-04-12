const validator = require('../helper/validator')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const { sequelize, User , Refreshtoken } = require('../models/index')
const RefreshtokenData = require('../dataaccess/refreshtoken')
const controller = {}



controller.login = async (req,res,next)=>{
    const rules = {
        "email": "required|email",
        "password": "required|string|min:6",
    }

    validator(req.body,rules,{}).then(async (response)=>{
        if(!response.status){
           res.send(response.err)
        }else{
        const { email , password } = req.body
            
        let user = await User.findOne({where: {email: email}})
        if(!user){
            res.status(401).json({msg: 'No user found'})
            // res.json({error: 'No user found'})
        }

        let passwordcheck = await bcrypt.compareSync(password, user.password)
        if(passwordcheck){
            const payload = { id: user.id }
            const token = jwt.sign(payload, process.env.SECRET_KEY,{expiresIn: '12h'})
            const refreshtoken = jwt.sign(payload,process.env.REFRESH_SECRET_KEY)
            // const refreshtoken = jwt.sign(payload,process.env.REFRESH_SECRET_KEY,{expiresIn: '2d'}) // refresh token is longer than access token
            RefreshtokenData.saveRefreshToken(refreshtoken,user.id)
            res.json({accesstoken: token,refreshtoken: refreshtoken,user: {fullname: user.fullname,usertype: user.usertype,email: user.email}})
        }else {
            res.status(401).json({ msg: 'Password is incorrect' })
           // res.json({error: 'Password is Incorrect'})
        }
       
        }
    })
    .catch(err=>console.log(err))
    return
}

controller.refreshtoken = async (req,res,next)=>{
   
    const { refreshtoken } = req.body
    if (refreshtoken == null) return res.status(401).json({msg: "Refresh token is required"})
    const findtoken = await RefreshtokenData.getRefreshtoken(refreshtoken)
    if(!findtoken) return res.status(403).json({msg: "No token Found"})

    jwt.verify(refreshtoken,process.env.REFRESH_SECRET_KEY,async (err,user)=>{

		if(err) res.sendStatus(403)

			// res.json(user.id)
			let payload = { id: user.id }

            const newtoken = jwt.sign(payload, process.env.SECRET_KEY,{expiresIn: '12h'})
            const newrefreshtoken = jwt.sign(payload,process.env.REFRESH_SECRET_KEY)
            // const newrefreshtoken = jwt.sign(payload,process.env.REFRESH_SECRET_KEY,{expiresIn: '2d'}) // refresh token is longer than access token
            RefreshtokenData.saveRefreshToken(newrefreshtoken,user.id)
            RefreshtokenData.revoke(refreshtoken)
            // RefreshtokenData.remove(refreshtoken)
            const userinfo = await User.findByPk(user.id)
			res.json({accesstoken: newtoken,refreshtoken: newrefreshtoken,user: {fullname: userinfo.fullname,usertype: userinfo.usertype,email: userinfo.email}})
    })
    
}

controller.logout = async (req,res,next) => {
    const user = await req.user
    Refreshtoken.destroy({where: {userId: user.id}}).then(result=>res.json(`refresh tokens are deleted`)).catch(err=>console.log(err))
}

module.exports = controller