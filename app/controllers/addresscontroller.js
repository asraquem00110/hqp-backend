const validator = require('../helper/validator')
const { sequelize, Address } = require('../models/index')
const AddressData = require('../dataaccess/address')
const controller = {}


controller.save = (req,res,next)=>{
    const rules = {
        "address": "required|string",
        "householdNo": ["required","string","regex:/^\\d{8}$/"],
        "streetId": "required|integer",
    }

    validator(req.body,rules,{}).then(async (response)=>{
        if(!response.status){
            res.json(response.err)
         }else{
             const { address , householdNo , streetId } = req.body
             const newaddress = {
                address: address,
                householdNo: householdNo,
                streetId: streetId,
             }
     
             await Address.create(newaddress)
             res.json("saved")
         }
    }).catch(err=>console.log(err))
}



controller.getlist = (req,res,next)=>{
    AddressData.getAll().then(result=>res.json({data: result})).catch(err=>res.json(err))
}

controller.update = (req,res,next)=>{
    const idno = req.params.idno
    const rules = {
        "address": "required|string",
        "householdNo": ["required","string","regex:/^\\d{8}$/"],
        "streetId": "required|integer",
    }

    validator(req.body,rules,{}).then(async (response)=>{
        if(!response.status){
           res.json(response.err)
        }else{
            const { address , householdNo , streetId } = req.body
            const newaddress = {
               address: address,
               householdNo: householdNo,
               streetId: streetId,
            }

            let updateresult = await Address.update(newaddress,{where: {id: idno}})
            if(updateresult == 0) res.status(401).json("no record found")    
            res.json("updated")
        }
    })
    .catch(err=>console.log(err))
}

controller.remove = (req,res,next)=>{
    const idno = req.params.idno
    Address.destroy({where: {id: idno}}).then(result=>res.json("deleted")).catch(err=>console.log(err))
}

controller.getDetails = async (req,res,next)=>{
    const idno = req.params.idno
    const data = await AddressData.getAddress(idno)
    res.json({data: data})
}

module.exports = controller