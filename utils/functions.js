const db = require('../config/db.js');
var dayjs = require('dayjs');
var bcrypt = require("bcryptjs");
const { DATEFORMAT } = require('./constants.js');

const format = 'DDMM-YY'
const getBatchId = (shiftType) => {
    let shift = shiftType == 'Morning' ? 'A' : shiftType == 'Evening' ? 'B' : shiftType == 'Night' ? 'C' : 'A';
    let currentDate = dayjs().format(format)
    return shift + '-' + currentDate
}
const checkUserExists = (req, res, next) => {
    let userId = req.headers['userid']
    let query = `Select userName from usermaster where userId=${userId} AND isActive='1' AND deleted=0`
    executeGetQuery(query, (err, results) => {
        if (err) console.log("Error", err)
        else if (!results.length) res.status(406).json("Something went wrong")
        else next()
    })
}
const checkDepartmentExists = (req, res, next) => {
    let isSuperAdmin = req.headers['issuperadmin']
    if (isSuperAdmin == 'true') {
        next()
    } else {
        let departmentid = req.headers['departmentid']
        let query = `Select departmentName from departmentmaster where departmentId=${departmentid} AND isApproved=1 AND deleted=0`
        executeGetQuery(query, (err, results) => {
            if (err) console.log("Error", err)
            else if (!results.length) res.status(406).json("Something went wrong")
            else next()
        })
    }
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
const convertToWords = (number) => {
    var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    if ((number = number.toString()).length > 9) return 'overflow';
    n = ('000000000' + number).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str.toUpperCase();
}
var createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
var dateComparisions = (startDate, endDate, type) => {
    if (type == 'Today') {
        startDate = dayjs(startDate).subtract(1, 'day').format(DATEFORMAT)
        endDate = startDate
    }
    else if (type == 'This Week') {
        startDate = dayjs(startDate).subtract(7, 'day').format(DATEFORMAT)
        endDate = dayjs(startDate).add(6, 'day').format(DATEFORMAT)
    }
    else if (type == 'This Month') {
        startDate = dayjs(startDate).subtract(5, 'day').startOf('month').format(DATEFORMAT)
        endDate = dayjs(startDate).endOf('month').format(DATEFORMAT)
    }
    console.log({ startDate, endDate })
    return { startDate, endDate }
}

const productionCount = (productionResult) => {
    let product20LCount = 0, product1LCount = 0, product500MLCount = 0, product250MLCount = 0;

    let productionObj = productionResult[0];
    let { total20LCans = 0, total1LBoxes = 0, total500MLBoxes = 0, total250MLBoxes = 0 } = productionObj;

    product20LCount = total20LCans;
    product1LCount = total1LBoxes;
    product500MLCount = total500MLBoxes;
    product250MLCount = total250MLBoxes;
    return { product20LCount, product1LCount, product500MLCount, product250MLCount };
}
module.exports = {
    executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery, checkDepartmentExists, productionCount,
    dateComparisions, checkUserExists, dbError, getBatchId, customerProductDetails, createHash, convertToWords
}