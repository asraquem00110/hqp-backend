const Validator = require('validatorjs')
const { User } = require('../models/index')


const validator = (body, rules, customMessages) => {
    return new Promise((resolve,reject)=>{
        try {
            const validation = new Validator(body, rules, customMessages);
            validation.passes(() => resolve({err: null, status: true}));
            validation.fails(() => resolve({err: validation.errors, status: false}));
        }catch(err){
            reject(err)
        }
      
    })
};

// custom validation 
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)./
// Tighten password policy
                    // customname  ,    condition     ,        custommessage
Validator.register('strict', value => passwordRegex.test(value),'password must contain at least one uppercase letter, one lowercase letter and one number');

// // check duplication of column

Validator.registerAsync('unique', async (value,  attribute, req , passes) => {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: unique:table,column');
    //split table and column
    let attArr = attribute.split(",");
    if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);
    //assign array index 0 and 1 to table and column respectively
    const { 0: table, 1: column } = attArr;
    //define custom error message
    let msg = (column == "email") ? `${column} has already been taken `: `${column} already in use`

    //check if incoming value already exists in the database
    // query logic here
    let user = await User.count({where: {email: value}})
    if(user>=1){
        // means there is already registered email in DB
        passes(false, msg)
    }else{
        passes(true)
        return
    }

    

});

module.exports = validator