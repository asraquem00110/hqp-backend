const validator = require('../helper/validator')
const { sequelize, Barangay, Street , User, Family} = require('../models/index')
const FamilyData = require('../dataaccess/family')
const controller = {}


controller.getData = async (req,res,next)=>{
    const dashboardData = {}
    const tabledata = await sequelize.query('SELECT b.barangay,COUNT(f.id) as registeredFamilies, COUNT(m.id) as registeredMembers FROM barangays b LEFT JOIN addresses a ON b.id = a.barangayId LEFT JOIN families f ON a.id = f.addressId LEFT JOIN members m ON f.id = m.familyId GROUP BY b.barangay ORDER BY COUNT(m.id) DESC', { type: sequelize.QueryTypes.SELECT})
    const barangaycount = await Barangay.count()
    const streetcount = await Street.count()
    const usercount = await User.count()
    const familycount = await Family.count()
    dashboardData.tabledata = tabledata
    dashboardData.barangaycount = barangaycount
    dashboardData.streetcount = streetcount
    dashboardData.usercount = usercount
    dashboardData.familycount = familycount
    res.json(dashboardData)
}


controller.getQrCodeInformation = (req,res,next)=>{
    const { qrcode } = req.body
    FamilyData.getDetailsViaQrCode(qrcode).then(result=>res.json({data: result})).catch(err=>res.json(err))
}

module.exports = controller