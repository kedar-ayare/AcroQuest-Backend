const errors = {
    "NewUSer-02": "Payload Incomplete",
    "NewUser-03": "Username should be alteast 5 characters long",
    "NewUser-04" : "Email should be atleast 7 characters long",
    "NewUser-05" : "Email does not follow the required pattern.",
    "NewUser-06" : "Password should be atleast 8 characters long",

    "LogError-01": "Username/Password missing",
    "LogError-04": "Username should be alteast 5 characters long",
    "LogError-05": "Password should be atleast 8 characters long",

    "NewAcro-01": "Payload Incomplete",
    "NewAcro-02": "Acronym should be atleast 2 characters long",

}


function getErrorMessage(error){
    return errors[error]
}

module.exports = getErrorMessage