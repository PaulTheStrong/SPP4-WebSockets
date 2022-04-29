const { model } = require("mongoose");
const User = require('../model/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function authenticateUser(username, password) {
    try {
        let user = await User.findOne({ username }, "_id username password").exec();
        if (!bcrypt.compareSync(password, user.password)) {
            return {code: 401, msg: "Invalid password"};
        }
        return {code: 200, msg: "You have been successfully authorized", token: createToken(user)};    
    } catch (err) {
        return {code: 404, msg: "User not found"};
    }
}

function createToken(user) {
    return jwt.sign({
        userId: user._id    
    }, 'secret', { expiresIn: '5m' });
}

function checkToken(req, res, next) {
    console.log("Cookies: " + JSON.stringify(req.cookies, null, ' '));
    jwt.verify(req.cookies["token"], "secret", (err, decoded) => {
        if (err) {
           res.status(401).send("Error: " + err);
           return; 
        }
        next();
    })
}

module.exports = {authenticateUser, createToken, checkToken};