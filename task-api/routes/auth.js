const { authenticateUser, createToken } = require('../service/authService');

const router = require('express').Router(),
    User = require('../model/user'),
    bcrypt = require('bcrypt');

router.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username == null || username.length < 4 || username.length > 20 ) {
        res.status(400).send({message: "Username length must be between 4 and 20"});
        return;
    }

    if (password == null || password.length < 4 || password.length > 64) {
        res.status(400).send({message: "Password length must be between 4 and 64"});
        return;
    }

    let user = new User({username, password: bcrypt.hashSync(password, 10)});
    try {
        user.save((err, savedUser) => {
            if (err) {
                console.log(err);
                res.status(400).send({message: "Unable to register new user"});
                return;
            }
            let token = createToken(savedUser);
            res.status(200)
                .cookie("token", JSON.stringify(token), {httpOnly: true, secure: true, expires: new Date(Date.now() + 60 * 5 * 1000)})
                .send("User has been registered");
        });
    } catch (err) {
        console.log(err);
    }
})

router.post("/", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let result = await authenticateUser(username, password);
    if (result.code == 200) {
        res.status(result.code)
            .cookie("token", result.token, { secure: true, httpOnly: true, expires: new Date(Date.now() + 60 * 5 * 1000), sameSite: 'none' })
            .send({ message: result.msg });
    } else {
        res.status(result.code)
            .send({message: result.msg});
    }
})


module.exports = router;