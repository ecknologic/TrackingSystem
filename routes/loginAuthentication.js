var express = require('express');
var router = express.Router();
const db = require('../config/db.js')
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
var bcrypt = require("bcryptjs");
const motherPlantDbQueries = require('../dbQueries/motherplant/queries.js');
const warehouseQueries = require('../dbQueries/warehouse/queries.js');


router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});


router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;


    let loginQuery;
    if (req.query.webUser) loginQuery = `SELECT u.RoleId,u.userId,u.departmentId,u.userName,u.password,r.RoleName FROM usermaster u INNER JOIN rolemaster r ON u.roleId=r.RoleId LEFT JOIN departmentmaster d 
    ON u.departmentId=d.departmentId WHERE  ( u.departmentId IS NULL OR (d.deleted='0' AND d.isApproved='1')) AND (u.emailid=? OR u.loginId=?) AND u.deleted='0'`;
    else loginQuery = "SELECT d.driverId,d.driverName,d.password,d.departmentId FROM driverdetails d WHERE (emailid=? OR loginId=?) AND deleted='0'"
    let reqBody = [username, username]
    let result = db.query(loginQuery, reqBody, (err, results) => {
        //var  passwordIsValid= bcrypt.compareSync(password,encryptedPassword);

        if (err) res.json({ status: 404, message: err.sqlMessage });
        else if (results.length == 0)
            res.json({ status: 404, message: "You have entered an invalid username or password" });
        else {
            passwordIsValid = bcrypt.compareSync(password, results[0].password);
            if (!passwordIsValid)
                res.json({ status: 401, message: "You have entered an invalid username or password" });
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

router.get('/getDepartmentsList', (req, res) => {
    motherPlantDbQueries.getDepartmentsList(req.query.departmentType, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            req.query.hasAll == 'true' && results.push({ departmentId: 'All', departmentName: 'All' })
            res.json(results)
        }
    });
});
router.get('/getAllDepartmentsList', (req, res) => {
    motherPlantDbQueries.getAllDepartmentsList(req.query.availableOnly, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else {
            req.query.hasNone == 'true' && results.push({ departmentId: null, departmentName: 'None' })
            res.json(results)
        }
    });
});

router.get('/getVehicleDetails', (req, res) => {
    motherPlantDbQueries.getVehicleDetails((err, results) => {
        if (err) res.status(500).json(dbError(err));
        res.json(results);
    });
});
router.get('/getdriverDetails/:warehouseId', (req, res) => {
    let warehouseId = req.params.warehouseId;
    let query = "select * from driverdetails where departmentId=" + warehouseId;
    db.query(query, (err, results) => {
        if (err) res.status(500).json(err.sqlMessage);
        res.send(JSON.stringify(results));
    });
});
router.get('/getroutes', (req, res) => {
    let query = "select r.*,d.departmentName from routes r INNER JOIN departmentmaster d ON r.departmentId=d.departmentId WHERE r.deleted='0' ORDER BY r.createdDateTime DESC";
    db.query(query, (err, results) => {
        if (err) res.status(500).json(err.sqlMessage);
        res.send(JSON.stringify(results));
    });
});

module.exports = router;
