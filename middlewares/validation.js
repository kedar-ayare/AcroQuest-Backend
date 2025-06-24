const {decrypt} = require("../utilities/encrypt")
const getErrorMessage = require("../utilities/errors")
const { getAESKey } = require("../utilities/sessionService")


// Function to Validate req.body based on schema passed
const validate = (schema, property ='body') => {
    return  async (req, res, next) => {

        if(req.headers.sessionid == undefined){
            res.status(400).json({success: false, error:"No Session ID"})
        }
        // Descrypts the Body to be validatedw
        const AESKey = await getAESKey(req.headers.sessionid)
        const decrypted = {}
        console.log(AESKey)
        console.log(req.body)
        for(const key in req[property]){
            console.log(req[property][key], AESKey)
            decrypted[key] = decrypt(req[property][key], AESKey)
        }
        req.body = decrypted
        req.AESKey = AESKey
        
        // Validates against constraints set using Joi
        const {error} = schema.validate(decrypted);
        if(error){
            return res.status(400).json({success:false,error: error.details[0].message, msg:getErrorMessage(error.details[0].message)})
        }
        next();
    }
}

module.exports = validate