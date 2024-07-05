const jwt = require("jsonwebtoken");

const authmiddleware = (req, res, next) =>{
    const token = req.headers.authorization;

    if(!token){
        res.status(400).json({message: "Authorization token is required"});
    }

    try {
        const decodedToken = jwt.verify(token, 'secret');
        req.userId = decodedToken.userId;
        next();
    }
    catch(err){
        console.error('Error verifying token:', err);
        
        res.status(403).json({ message: `invalid token: ${token}` });
    }
};

module.exports = authmiddleware;