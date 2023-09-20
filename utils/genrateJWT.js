const jwt = require('jsonwebtoken');//create data with optional signature

module.exports = async(payload)=>{
    // generate JWT token
    const token = await jwt.sign(
        payload, 
        process.env.JWT_SECRET_KEY, 
        {expiresIn: '1m'}
    );

    return token;
};