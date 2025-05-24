const Joi = require('joi')


// For whenever a new user is created
const newUserSchema = Joi.object({
    uname: Joi.string().min(5).required().messages({
        'any.required':'NewUser-02',
        'string.min':'NewUser-03'
    }),
    email: Joi.string().min(7).required().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).messages({
        'any.required':'NewUser-02',
        'string.min':'NewUser-04',
        'string.pattern.base': 'NewUser-05' 
    }),
    password: Joi.string().min(8).required().messages({
        'any.required':'NewUser-02',
        'string.min':'NewUser-06'
    })
});

// For whenever a user tries to login
const loginUserSchema = Joi.object({
    uname: Joi.string().min(5).required().messages({
        'any.required':'LogError-01',
        'string.min':'LogError-04'
    }),
    password: Joi.string().min(8).required().messages({
        'any.required':'LogError-01',
        'string.min':'LogError-05'
    })
})

// For whenever a new Acro is created
const newAcroSchema = Joi.object({
    acro: Joi.string().min(2).required().messages({
        'any.required': 'NewAcro-01',
        'string.min': 'NewAcro-02',
    }),
    full_form: Joi.string().required().messages({
        'any.required': 'NewAcro-01'
    }),
    description: Joi.string().required().messages({
        'any.required': 'NewAcro-01'
    })
})

module.exports = {
    newUserSchema,
    loginUserSchema,
    newAcroSchema
}