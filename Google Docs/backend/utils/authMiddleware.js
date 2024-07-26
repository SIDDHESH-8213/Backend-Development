const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) =>{
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message: `Authentication token is missing`});
    }

    try{
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch(error){
        res.status(401).json({message: 'Invalid token'});
    }
}

module.exports = authMiddleware;