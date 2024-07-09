const express = require("express");
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next)=>{
    const token = req.headers.authorization;

    if(!token){
        res.status(400).json({message: 'Authorization token is required'});
    }
    try{
        const decodedToken = jwt.verify(token, 'secret');
        const userId = decodedToken.userId;
        next();
    }
    catch(error){
        console.error(`Error veryfying token`);
        res.status(403).json({message: `invalid token: ${token}`});
    }
}

module.exports = authMiddleware;