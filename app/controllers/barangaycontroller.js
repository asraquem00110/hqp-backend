const validator = require('../helper/validator')
const { sequelize, Barangay } = require('../models/index')
const BarangayData = require('../dataaccess/barangay')
const controller = {}

controller.saveBarangay = (req,res,next)=>{
    const rules = {
        "barangay": "required|string",
        "code":  ["required","string","regex:/^[A-Z]\\d{4}\\-[A-Z]$/"],
        "district": "required|integer|digits:1",
        "chairman": "required|string",
    }

    validator(req.body,rules,{}).then(async (response)=>{
        if(!response.status){
           res.json(response.err)
        }else{
            const { barangay , code , district , chairman } = req.body
            const newbarangay = {
                barangay: barangay,
                code: code,
                district: district,
                chairman, chairman,
            }

            let savebarangay = await Barangay.create(newbarangay)
            let barangaydata = await BarangayData.getBarangay(savebarangay.id)  
            res.json(barangaydata)
        }
    })
    .catch(err=>console.log(err))
}

controller.getlist = (req,res,next)=>{
    BarangayData.getAll().then(result=>res.json({data: result})).catch(err=>res.json(err))
}

controller.getbarangay = (req,res,next)=>{
    BarangayData.getSearchbarangay(req.params.barangay).then(result=>res.json({data: result})).catch(err=>res.json(err))
}

controller.getPlainList = (req,res,next)=>{
    BarangayData.getPlainList().then(result=>res.json({data: result})).catch(err=>res.json(err))
}

controller.update = (req,res,next)=>{
    const idno = req.params.idno
    const rules = {
        "barangay": "required|string",
        "code":  ["required","string","regex:/^[A-Z]\\d{4}\\-[A-Z]$/"],
        "district": "required|integer|digits:1",
        "chairman": "required|string",
    }

    validator(req.body,rules,{}).then(async (response)=>{
        if(!response.status){
           res.json(response.err)
        }else{
            const { barangay , code , district , chairman } = req.body
            const newbarangay = {
                barangay: barangay,
                code: code,
                district: district,
                chairman, chairman,
            }

            let updateresult = await Barangay.update(newbarangay,{where: {id: idno}})
            if(updateresult == 0) res.status(401).json("no record found") 
            let barangaydata = await BarangayData.getBarangay(idno)  
            res.json(barangaydata)
        }
    })
    .catch(err=>console.log(err))
}

controller.archive = async (req,res,next)=>{
    const idno = req.params.idno
    let archiveres = await Barangay.update({archive: 1},{where: {id: idno}})
    if(!archiveres)res.status(500).json("something went wrong")
    if(archiveres) res.json("archived")
    
}

controller.remove = (req,res,next)=>{
    const idno = req.params.idno
    Barangay.destroy({where: {id: idno}}).then(result=>res.json("deleted")).catch(err=>console.log(err))
}

controller.getDetails = async (req,res,next)=>{
    const idno = req.params.idno
    const data = await BarangayData.getBarangay(idno)
    res.json({data: data})
}

module.exports = controller