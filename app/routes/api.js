const express = require('express')
const app = express()
const passport = require('../helper/passport')
app.use(passport.initialize())
const {checkisAuthenticated,checknotAuthenticated,PassportAuthenticate} = require('../helper/authenticator')
const barangaycontroller = require('../controllers/barangaycontroller')
const streetcontroller = require('../controllers/streetcontroller')
const addresscontroller = require('../controllers/addresscontroller')
const familycontroller = require('../controllers/familycontroller')
const usercontroller = require('../controllers/usercontroller')
const apicontroller = require('../controllers/apicontroller')


app.post('/barangay/save',PassportAuthenticate(passport),checkisAuthenticated,barangaycontroller.saveBarangay)
app.get('/barangay/getlist',PassportAuthenticate(passport),checkisAuthenticated,barangaycontroller.getlist)
app.get('/barangay/getlist/(:barangay)',PassportAuthenticate(passport),checkisAuthenticated,barangaycontroller.getbarangay)
app.get('/barangay/getPlainList',PassportAuthenticate(passport),checkisAuthenticated,barangaycontroller.getPlainList)
app.patch('/barangay/update/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,barangaycontroller.update)
app.patch('/barangay/archive/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,barangaycontroller.archive)
app.delete('/barangay/remove/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,barangaycontroller.remove)
app.get('/barangay/details/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,barangaycontroller.getDetails)


app.post('/street/save',PassportAuthenticate(passport),checkisAuthenticated,streetcontroller.save)
app.get('/street/getList',PassportAuthenticate(passport),checkisAuthenticated,streetcontroller.getList)
app.patch('/street/update/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,streetcontroller.update)
app.patch('/street/archive/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,streetcontroller.archive)
app.delete('/street/remove/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,streetcontroller.remove)
app.get('/street/details/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,streetcontroller.getDetails)
app.get('/street/getList/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,streetcontroller.getStreetByBarangay)
app.get('/street/getList/(:idno)/(:street)',PassportAuthenticate(passport),checkisAuthenticated,streetcontroller.getStreet)
app.get('/street/getPlainList/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,streetcontroller.getPlainList)


app.post('/address/save',PassportAuthenticate(passport),checkisAuthenticated,addresscontroller.save)
app.get('/address/getlist',PassportAuthenticate(passport),checkisAuthenticated,addresscontroller.getlist)
app.patch('/address/update/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,addresscontroller.update)
app.delete('/address/remove/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,addresscontroller.remove)
app.get('/address/details/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,addresscontroller.getDetails)


app.post('/family/save',PassportAuthenticate(passport),checkisAuthenticated,familycontroller.save)
app.get('/family/getlist',PassportAuthenticate(passport),checkisAuthenticated,familycontroller.getlist)
app.get('/family/getlist/(:family)',PassportAuthenticate(passport),checkisAuthenticated,familycontroller.getFamily)
app.patch('/family/update/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,familycontroller.update)
app.delete('/family/remove/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,familycontroller.remove)
app.get('/family/details/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,familycontroller.getDetails)
app.post('/family/newData',PassportAuthenticate(passport),checkisAuthenticated,familycontroller.newData)
app.post('/family/savemember',PassportAuthenticate(passport),checkisAuthenticated,familycontroller.savemember)
app.post('/family/newmember',PassportAuthenticate(passport),checkisAuthenticated,familycontroller.newmember)
app.get('/family/getDetails/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,familycontroller.getFamilyInfo)
app.patch('/family/updateDetails/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,familycontroller.updateDetails)
app.delete('/family/removeMember/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,familycontroller.removeMember)
app.patch('/family/updateMember/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,familycontroller.updateMember)

app.post('/user/save',PassportAuthenticate(passport),checkisAuthenticated,usercontroller.save)
app.get('/user/getlist',PassportAuthenticate(passport),checkisAuthenticated,usercontroller.getlist)
app.get('/user/getlist/(:user)',PassportAuthenticate(passport),checkisAuthenticated,usercontroller.getUser)
app.patch('/user/update/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,usercontroller.update)
app.patch('/user/archive/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,usercontroller.archive)
app.patch('/user/changepass/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,usercontroller.changepass)
app.delete('/user/remove/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,usercontroller.remove)
app.get('/user/details/(:idno)',PassportAuthenticate(passport),checkisAuthenticated,usercontroller.getDetails)

app.get('/dashboard/getData',PassportAuthenticate(passport),checkisAuthenticated,apicontroller.getData)
app.post('/mobile/getQrCodeInformation',apicontroller.getQrCodeInformation)


module.exports = app