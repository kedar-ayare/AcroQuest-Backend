const decrypt = require("../utilities/decrypt")
const getErrorMessage = require("../utilities/errors")


// Function to Validate req.body based on schema passed
const validate = (schema, property ='body') => {
    return  async (req, res, next) => {

        // Descrypts the Body to be validatedw
        const decrypted = {}
        for(const key in req[property]){
            decrypted[key] = await decrypt(req[property][key])
        }

        // Validates against constraints set using Joi
        const {error} = schema.validate(decrypted);
        if(error){
            return res.status(400).json({success:false,error: error.details[0].message, msg:getErrorMessage(error.details[0].message)})
        }
        next();
    }
}

module.exports = validate