const controller = {}
const validator = require('../helper/validator')
const Sequelize = require('sequelize')
const {sequelize,Street} = require('../models/index')
const StreetData = require('../dataaccess/street')


controller.save = (req,res,next)=>{
  const rules = {
      "street": "required|string",
      "purokLeader": "required|string",
      "barangayId": "required|integer",
  }

  validator(req.body,rules,{}).then(async (response)=>{
    if(!response.status){
       res.json(response.err)
    }else{
        const { street , purokLeader , barangayId } = req.body
        const newstreet = {
            street: street,
            purokLeader: purokLeader,
            barangayId: barangayId,
        }

        const street_ = await Street.create(newstreet)
        let streetdata = await StreetData.getStreet(street_.id)  
        res.json(streetdata)
    }
})
.catch(err=>console.log(err))
}

controller.getList = (req,res,next)=>{
    StreetData.getAll().then(result=>res.json({data: result})).catch(err=>res.json(err))
}



controller.getPlainList = (req,res,next)=>{
    const idno = req.params.idno
    StreetData.getPlainList(idno).then(result=>res.json({data: result})).catch(err=>res.json(err))
}

controller.getStreetByBarangay = (req,res,next)=>{
    const idno = req.params.idno
    StreetData.getStreetByBarangay(idno).then(result=>res.json({data: result})).catch(err=>res.json(err))
}

controller.getStreet = (req,res,next)=>{
    const idno = req.params.idno
    const street = req.params.street
    StreetData.getSearchStreet(idno,street).then(result=>res.json({data: result})).catch(err=>res.json(err))
}


controller.update = (req,res,next)=>{
    const idno = req.params.idno
    const rules = {
        "street": "required|string",
        "purokLeader": "required|string",
        "barangayId": "required|integer",
    }

    validator(req.body,rules,{}).then(async (response)=>{
        if(!response.status){
           res.json(response.err)
        }else{
            const { street , purokLeader , barangayId } = req.body
            const newstreet = {
                street: street,
                purokLeader: purokLeader,
                barangayId: barangayId,
            }

            let updateresult = await Street.update(newstreet,{where: {id: idno}})
            
    
            if(updateresult == 0) res.status(401).json("no record found")    
            let streetdata = await StreetData.getStreet(idno)  
            res.json(streetdata)
            
        }
    })
    .catch(err=>console.log(err))
}

controller.archive = async (req,res,next)=>{
    const idno = req.params.idno
    let archiveres = await Street.update({archive: 1},{where: {id: idno}})
    if(!archiveres)res.status(500).json("something went wrong")
    if(archiveres) res.json("archived")
}

controller.remove = (req,res,next)=>{
    const idno = req.params.idno
    Street.destroy({where: {id: idno}}).then(result=>res.json("deleted")).catch(err=>console.log(err))
}

controller.getDetails = async (req,res,next)=>{
    const idno = req.params.idno
    const data = await StreetData.getStreet(idno)
    res.json({data: data})
}

module.exports = controller