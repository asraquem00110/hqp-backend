const validator = require('../helper/validator')
const { sequelize, Family , Address , Member } = require('../models/index')
const FamilyData = require('../dataaccess/family')
const MemberData = require('../dataaccess/member')
const controller = {}
var crypto = require("crypto")
var formidable = require('formidable')
var fs = require('fs')

controller.newData = async (req,res,next)=>{


    const rules = {
        "name": "required|string",
        "household": "required|string",
        "address": "required|string",
        "barangay": "required|integer",
        "street": "required|integer",
        "members": "required",
        }

        validator(req.body,rules,{}).then(async (response)=>{
            if(!response.status){
                res.json(response.err)
            }else{

                sequelize.transaction(async (t) => {

                        const { name, household , address , barangay , street } = req.body
                        const newFamily = {
                            family: name,
                        }
                        var familysave = await Family.create(newFamily,{transaction: t})

                        const newAddress = {
                            address: address,
                            householdNo: household,
                            streetId: street,
                            barangayId: barangay
                        }

                        const addresssave = await Address.create(newAddress,{transaction: t})
                        const cryptorandom = crypto.randomBytes(10).toString('hex')
                        const randomQrCode = `QRcode${cryptorandom+familysave.id}`

                        familysave.addressId = addresssave.id
                        familysave.QrCode = randomQrCode
                        familysave.save()   
                        res.json({familyid: familysave.id,msg: "Transaction has been committed"})
                }).then(result => {
                    console.log("Transaction has been committed")           
                }).catch(err => {
                    console.log(err)
                    // console.log("Something went wrong!!")
                    res.status(500).json("Something went wrong!!")
                });
            }   
        }).catch(err=>console.log(err))

}

controller.updateDetails = (req,res,next)=>{
    const rules = {
        "family": "required|string",
        "household": "required|string",
        "address": "required|string",
        "barangay": "required|integer",
        "street": "required|integer",
    }

    validator(req.body,rules,{}).then(async (response)=>{
        if(!response.status){
            res.json(response.err)
        }else{
            sequelize.transaction(async (t) => {

                const { id, family, household , address , barangay , street , addressID } = req.body
                const newFamily = {
                    family: family,
                }
                var familysave = await Family.update(newFamily,{where: {id: id}},{transaction: t})

                const newAddress = {
                    address: address,
                    householdNo: household,
                    streetId: street,
                    barangayId: barangay
                }

                const addresssave = await Address.update(newAddress,{where:{id: addressID}},{transaction: t})
                const familyInfo = await FamilyData.getDetails(id)
                res.json({data: familyInfo})
            }).then(result => {
                console.log("Transaction has been committed")           
            }).catch(err => {
                console.log(err)
                // console.log("Something went wrong!!")
                res.status(500).json("Something went wrong!!")
            });

        }
    })
}

controller.removeMember = async (req,res,next)=>{
    const idno = req.params.idno
    const memberdata = await MemberData.getMemberData(idno)
    const destroyResult = await Member.destroy({where:{id: memberdata.id}})

    if(destroyResult){
        const imagepath = `./public/images/families/${memberdata.familyId}/${memberdata.img}`
        if(memberdata.img != null && memberdata.img != ""){
            fs.unlink(imagepath, function (err) {
                if (err) throw err;
            });       
        }
    }

    const familyInfo = await FamilyData.getDetails(memberdata.familyId)
    res.json({data: familyInfo})
    
}

controller.savemember = (req,res,next)=>{
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files)=> {

        const imagename = files.imgfile ? files.imgfile.name : null
        var member = {
            fname: fields.fname,
            Bday: fields.Bday,
            familyId: fields.familyId,
            gender: fields.gender,
            img: imagename,
        }

        if(member.img != null){
            var oldpath = files.imgfile.path;
            var newpath = `./public/images/families/${member.familyId}`

            if(!fs.existsSync(newpath)){
                fs.mkdirSync(newpath)
            }
        
            fs.readFile(oldpath,(err,data)=>{
                if(err) throw err
                fs.writeFile(`${newpath}/${files.imgfile.name}`,data,(err)=>{
                    if(err) throw err

                        fs.unlink(oldpath, function (err) {
						    if (err) throw err
						});
                })
            })
        }


        Member.create(member).then((result)=>{
            res.json({data: member})   
        }).catch((err)=>{
            res.json(err)   
        })

       
        
    })

}

controller.newmember = (req,res,next)=>{
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files)=> {

        const imagename = files.imgfile ? files.imgfile.name : null
        var member = {
            fname: fields.fname,
            Bday: fields.Bday,
            gender: fields.gender,
            familyId: fields.familyId,
            img: imagename,
        }

        const rules = {
            fname: "required|string",
            Bday: "required|date",
            gender: "required|string",
        }

        validator(member,rules,{}).then(async (response)=>{
            if(!response.status){
                res.json(response.err)
            }else{
                if(member.img != null){
                    var oldpath = files.imgfile.path;
                    var newpath = `./public/images/families/${member.familyId}`
        
                    if(!fs.existsSync(newpath)){
                        fs.mkdirSync(newpath)
                    }
                
                    fs.readFile(oldpath,(err,data)=>{
                        if(err) throw err
                        fs.writeFile(`${newpath}/${files.imgfile.name}`,data,(err)=>{
                            if(err) throw err
        
                                fs.unlink(oldpath, function (err) {
                                    if (err) throw err
                                });
                        })
                    })
                }
        
        
                Member.create(member).then(async (result)=>{
                    const familyInfo = await FamilyData.getDetails(member.familyId)
                    res.json({data: familyInfo})
                }).catch((err)=>{
                    res.json(err)   
                })
        
            }
        })

   
        
    })
}


controller.updateMember = (req,res,next)=>{
    const idno = req.params.idno
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files)=> {
        const data = {
            fname: fields.fname,
            Bday: fields.Bday,
            img: fields.img,
            gender: fields.gender,
        }
        const rules = {
            fname: 'required|string',
            Bday: "required|date",
            gender: "required|string"
        }

        validator(data,rules,{}).then(async(response)=>{
            if(!response.status){
                res.json(response.err)
            }else{  
                
         
                if(files.imgfile){
                    // data.img = files.imgfile.name

                    var oldpath = files.imgfile.path;
                    var newpath = `./public/images/families/${fields.familyId}`
        
                    if(!fs.existsSync(newpath)){
                        fs.mkdirSync(newpath)
                    }
                
                    fs.readFile(oldpath,(err,data)=>{
                        if(err) throw err
                        fs.writeFile(`${newpath}/${files.imgfile.name}`,data,(err)=>{
                            if(err) throw err
                            
                       
                           
                                if(fields.img != "null") {
                                    fs.unlink(`${newpath}/${fields.img}`, function (err) {
                                        if (err) throw err
                                    });
                                }
                  
                                
                                fs.unlink(oldpath, function (err) {
                                    if (err) throw err
                                });
                        })
                    })

                    data.img = files.imgfile.name
                }else if(fields.img == null || fields.img == "null"){
                    data.img = null
                }

             Member.update(data,{where: {id: idno}}).then(async (result)=> {
                const familyInfo = await FamilyData.getDetails(fields.familyId)
                res.json({data: familyInfo})
            }).catch((err)=>{
                res.json(err)   
            })

            }
        })

    })

}



controller.save = (req,res,next)=>{
    const rules = {
        "family": "required|string",
        "QrCode": "required|string",
        "addressId": "required|integer",
    }

    validator(req.body,rules,{}).then(async (response)=>{
        if(!response.status){
            res.json(response.err)
        }else{
            const {family,QrCode,addressId}= req.body
            const newFamily = {
                family: family,
                QrCode: QrCode,
                addressId: addressId
            }

            await Family.create(newFamily)
            res.json("saved")
        }
    }).catch(err=>console.log(err))
}

controller.getFamilyInfo = (req,res,next)=>{
    const idno = req.params.idno
    FamilyData.getDetails(idno).then(result=>res.json({data: result})).catch(err=>res.json(err))
}

controller.getlist = (req,res,next)=>{
    FamilyData.getAll().then(result=>res.json({data: result})).catch(err=>res.json(err))
}

controller.getFamily = (req,res,next)=>{
    const family = req.params.family
    FamilyData.searhFamily(family).then(result=>res.json({data: result})).catch(err=>res.json(err))
}

controller.update = (req,res,next)=>{
    const idno = req.params.idno
    const rules = {
        "family": "required|string",
        "QrCode": "required|string",
        "addressId": "required|integer",
    }

    validator(req.body,rules,{}).then(async (response)=>{
        if(!response.status){
           res.json(response.err)
        }else{
            const {family,QrCode,addressId}= req.body
            const newFamily = {
                family: family,
                QrCode: QrCode, 
                addressId: addressId
            }


            let updateresult = await Family.update(newFamily,{where: {id: idno}})
            if(updateresult == 0) res.status(401).json("no record found")    
            res.json("updated")
        }
    })
    .catch(err=>console.log(err))
}

controller.remove = (req,res,next)=>{
    const idno = req.params.idno
    Family.destroy({where: {id: idno}}).then(result=>res.json("deleted")).catch(err=>console.log(err))
}

controller.getDetails = async (req,res,next)=>{
    const idno = req.params.idno
    const data = await FamilyData.getFamily(idno)
    res.json({data: data})
}


module.exports = controller