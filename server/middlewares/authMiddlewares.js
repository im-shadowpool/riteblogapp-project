const jwt = require('jsonwebtoken');
const ErrorHttp = require("../models/modelError");

const authMiddleware = async (req, res, next) =>{
    const Authorization = req.headers.Authorization || req.headers.authorization
    if(Authorization && Authorization.startsWith('Bearer')){
        const token = Authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
            if(err){
                return next(new ErrorHttp('Unauthorised, Invalid token', 403))
            }
            req.user = info
            console.log('Successful AuthMiddleware');
            next()
        })
    }
    else{
        return next(new ErrorHttp('Unathorixed, No Token Found', 402))
    }
}

module.exports = authMiddleware;