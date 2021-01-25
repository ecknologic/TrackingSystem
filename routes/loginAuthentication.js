var express = require('express');
var router = express.Router();
const db = require('../config/db.js')
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
var bcrypt = require("bcryptjs");


router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});


router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;


    let loginQuery;
    if (req.query.webUser) loginQuery = "SELECT u.RoleId,u.userId,u.departmentId,u.userName,u.password,r.RoleName FROM usermaster u INNER JOIN rolemaster r ON u.roleId=r.RoleId WHERE (u.emailid=? OR u.loginId=?) AND deleted='0'";
    else loginQuery = "SELECT d.driverId,d.driverName,d.password,d.departmentId FROM driverdetails d WHERE (emailid=? OR loginId=?) AND deleted='0'"
    let reqBody = [username, username]
    let result = db.query(loginQuery, reqBody, (err, results) => {
        //var  passwordIsValid= bcrypt.compareSync(password,encryptedPassword);

        if (err) res.json({ status: 404, message: err.sqlMessage });
        else if (results.length == 0)
            res.json({ status: 404, message: "User Not Available" });
        else {
            passwordIsValid = bcrypt.compareSync(password, results[0].password);
            if (!passwordIsValid)
                res.json({ status: 401, message: "Invalid Details" });
            else {

                var data = JSON.stringify(results);

                var secret = config.secret;
                var now = Math.floor(Date.now() / 1000),
                    iat = (now - 10),
                    expiresIn = 3600,
                    expr = (now + expiresIn),
                    notBefore = (now - 10),
                    jwtId = Math.random().toString(36).substring(7);
                var payload = {
                    iat: iat,
                    jwtid: jwtId,
                    audience: 'BIBO',
                    data: data
                };

                jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: expiresIn }, function (err, token) {

                    if (err) {
                        console.log('Error occurred while generating token');
                        console.log(err);
                        return false;
                    }
                    else {
                        if (token != false) {
                            res.json({
                                status: 200,
                                role: results[0].RoleName,
                                roleId: results[0].RoleId,
                                userName: results[0].userName || results[0].driverName,
                                id: results[0].userId,
                                driverId: results[0].driverId,
                                warehouseId: results[0].departmentId,
                                isLogged: true,
                                // token: token
                            });
                        }
                        else {
                            res.status(400).json({ status: 400, message: "Could not create token" });
                        }

                    }
                });
            }
        }
    });
});

module.exports = router;
