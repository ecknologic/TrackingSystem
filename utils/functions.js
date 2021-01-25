const db = require('../config/db.js');
var dayjs = require('dayjs');
var bcrypt = require("bcryptjs");

const format = 'DDMM-YY'
const getBatchId = (shiftType) => {
    let shift = shiftType == 'Morning' ? 'A' : shiftType == 'Evening' ? 'B' : shiftType == 'Night' ? 'C' : 'A';
    let currentDate = dayjs().format(format)
    return shift + '-' + currentDate
}
const checkUserExists = (req, res, next) => {
    let userId = req.headers['userId']
    let query = `Select userName from usermaster where userId=${userId} AND isActive='1' AND deleted=0`
    executeGetQuery(query, (err, results) => {
        if (err) console.log("Error", err)
        else if (!results.length) res.status(406).json("Something went wrong")
        else next()
    })
}
const checkDepartmentExists = (req, res, next) => {
    let departmentid = req.headers['departmentid']
    let query = `Select departmentName from departmentmaster where departmentId=${departmentid} AND deleted=0`
    executeGetQuery(query, (err, results) => {
        if (err) console.log("Error", err)
        else if (!results.length) res.status(406).json("Something went wrong")
        else next()
    })
}
const executeGetQuery = (query, callback) => {
    try {
        return db.query(query, callback);
    }
    catch (err) {
        throw err
    }
}
const executeGetParamsQuery = (query, input, callback) => {
    try {
        return db.query(query, input, callback);
    }
    catch (err) {
        throw err
    }
}
const executePostOrUpdateQuery = (query, requestBody, callback) => {
    try {
        return db.query(query, requestBody, callback);
    }
    catch (err) {
        throw err
    }
}
const dbError = (err) => {
    let errMessage = err.sqlMessage || 'Something went wrong';
    switch (err.errno) {
        case 1146:
            errMessage = "Table doesn't exists";
            break;
    }
    return errMessage;
}
const customerProductDetails = (deliveryDetailsId) => {
    return new Promise((resolve, reject) => {
        let customerProductDetailsQuery = "SELECT cp.productName,cp.productPrice,cp.noOfJarsTobePlaced,cp.id AS productId FROM customerproductdetails cp WHERE deliveryDetailsId=?";
        db.query(customerProductDetailsQuery, [deliveryDetailsId], (err, results) => {
            if (err) reject(err)
            else {
                resolve(results)
            }
        });
    });
}
var createHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
module.exports = { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery, checkDepartmentExists, checkUserExists, dbError, getBatchId, customerProductDetails, createHash }