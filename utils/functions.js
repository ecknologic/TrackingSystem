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
    return { startDate, endDate }
}

const productionCount = (productionResult) => {
    let product20LCount = 0, product1LCount = 0, product500MLCount = 0, product300MLCount = 0, product2LCount = 0;

    let productionObj = productionResult[0];
    let { total20LCans = 0, total1LBoxes = 0, total500MLBoxes = 0, total300MLBoxes = 0, total2LBoxes = 0 } = productionObj;

    product20LCount = total20LCans;
    product1LCount = total1LBoxes;
    product500MLCount = total500MLBoxes;
    product300MLCount = total300MLBoxes;
    product2LCount = total2LBoxes;
    return { product20LCount, product1LCount, product500MLCount, product300MLCount, product2LCount };
}
const getCompareData = (currentValues, previousValues, type, isRs) => {
    const { product20LCount, product1LCount, product500MLCount, product300MLCount, product2LCount } = currentValues
    const { product20LCount: prev20LCount, product1LCount: prev1LCount,
        product500MLCount: prev500MLCount, product300MLCount: prev300MLCount, product2LCount: prev2LCount } = previousValues

    const totalProducts = product20LCount + product1LCount + product500MLCount + product300MLCount + product2LCount

    const product20LPercent = getPercent(product20LCount, prev20LCount)
    const product20LPartPercent = getSimplePercent(product20LCount, totalProducts)
    const product20LCompareText = getCompareText(type, prev20LCount, isRs)
    const product1LPercent = getPercent(product1LCount, prev1LCount)
    const product1LPartPercent = getSimplePercent(product1LCount, totalProducts)
    const product1LCompareText = getCompareText(type, prev1LCount, isRs)
    const product500MLPercent = getPercent(product500MLCount, prev500MLCount)
    const product500MLPartPercent = getSimplePercent(product500MLCount, totalProducts)
    const product500MLCompareText = getCompareText(type, prev500MLCount, isRs)
    const product300MLPercent = getPercent(product300MLCount, prev300MLCount)
    const product300MLPartPercent = getSimplePercent(product300MLCount, totalProducts)
    const product300MLCompareText = getCompareText(type, prev300MLCount, isRs)

    const product2LPercent = getPercent(product2LCount, prev2LCount)
    const product2LPartPercent = getSimplePercent(product2LCount, totalProducts)
    const product2LCompareText = getCompareText(type, prev2LCount, isRs)
    const prevTotal = getFormatedNumber(prev20LCount + prev1LCount + prev500MLCount + prev300MLCount + prev2LCount)
    const total = getFormatedNumber(totalProducts)

    return {
        product20LCount: getFormatedNumber(product20LCount), product1LCount: getFormatedNumber(product1LCount),
        product500MLCount: getFormatedNumber(product500MLCount), product500MLCount: getFormatedNumber(product500MLCount),
        product300MLCount: getFormatedNumber(product300MLCount), product2LCount: getFormatedNumber(product2LCount), product20LPercent, product20LCompareText, product1LPercent,
        product1LCompareText, product500MLPercent, product500MLCompareText, product300MLPercent, product300MLCompareText, product2LPercent, product2LCompareText, prevTotal, total,
        product20LPartPercent, product1LPartPercent, product500MLPartPercent, product300MLPartPercent, product2LPartPercent
    }
}
const getCompareCustomersData = (data, type) => {
    const { totalCustomers, activeCorporateCustomers, prevActiveCorporateCustomers,
        activeOtherCustomers, prevActiveOtherCustomers, totalDistributors } = data

    const totalCorporateCustomers = getFormatedNumber(activeCorporateCustomers)
    const totalIndividualCustomers = getFormatedNumber(activeCorporateCustomers)
    const corporateCustomersPercent = getPercent(activeCorporateCustomers, prevActiveCorporateCustomers)
    const corporateCustomersCompareText = getCompareText(type, prevActiveCorporateCustomers)
    const individualCustomersPercent = getPercent(activeOtherCustomers, prevActiveOtherCustomers)
    const individualCustomersCompareText = getCompareText(type, prevActiveOtherCustomers)

    return {
        totalCorporateCustomers, totalIndividualCustomers, totalCustomers: getFormatedNumber(totalCustomers + totalDistributors), corporateCustomersPercent, corporateCustomersCompareText,
        individualCustomersPercent, individualCustomersCompareText
    }
}

const getCompareDistributorsData = (data, type) => {
    const { totalInactiveCustomers, totalInactiveDistributors, pendingCorporateCustomers: pendingCorporate,
        pendingOtherCustomers, activeDistributors, prevActiveDistributors } = data

    const totalDistributors = getFormatedNumber(activeDistributors)
    const pendingCorporateCustomers = getFormatedNumber(pendingCorporate)
    const pendingIndividualCustomers = getFormatedNumber(pendingOtherCustomers)
    const distributorsPercent = getPercent(activeDistributors, prevActiveDistributors)
    const distributorsCompareText = getCompareText(type, prevActiveDistributors)


    return {
        distributorsPercent, totalInactiveCustomers: getFormatedNumber(totalInactiveCustomers + totalInactiveDistributors),
        distributorsCompareText, pendingIndividualCustomers, pendingCorporateCustomers, totalDistributors
    }
}

const getSimplePercent = (total = 0, grandTotal = 1) => {
    const result = Math.round((Number(total) / (Number(grandTotal) || 1)) * 100)
    return Number(result)
}

const getPercent = (current, previous) => {
    const difference = current - previous
    const signNum = Math.sign(difference)
    const sign = signNum === 1 ? '+' : signNum === -1 ? '-' : null
    if (difference) {
        return `${sign}${(Math.abs(difference) / (previous || difference) * 100).toFixed(2)}%`
    } else return '0.00%'
}
const getCompareText = (type, previous, isRs) => {
    const day = type == 'Today' ? 'Yesterday' : type == 'This Week' ? 'last Week' : type == 'This Month' ? 'last Month' : ''
    return type && type !== 'Till Now' ? `Compared to (${isRs ? '₹ ' : ''}${getFormatedNumber(Number(previous))} ${day})` : ''
}
const getFormatedNumber = (number) => {
    number = number || 0
    if (number >= 10000000) {
        number = getCrores(number)
    }
    else if (number >= 100000) {
        number = getLakhs(number)
    }
    else number = number.toLocaleString('en-IN')

    return number
}

const getLakhs = (amount) => {
    let minified = (amount / 100000)
    if (minified % 1 !== 0) {
        minified = minified.toFixed(1);
    }
    return `${minified.toLocaleString('en-IN')} L`;
}

const getCrores = (amount) => {
    let minified = (amount / 10000000)
    if (minified % 1 !== 0) {
        minified = minified.toFixed(2);
    }
    return `${minified.toLocaleString('en-IN')} Cr`;
}
const getGraphData = (product20LCount, product2LCount, product1LCount, product500MLCount, product300MLCount) => {
    return [
        {
            name: "20 Ltrs",
            label: "20 Ltrs",
            value: product20LCount
        },
        {
            name: "2 Ltrs",
            label: "2 Ltrs",
            value: product2LCount
        },
        {
            name: "1 Ltrs",
            label: "1 Ltrs",
            value: product1LCount
        },
        {
            name: "500 ml",
            label: "500 ml",
            value: product500MLCount
        },
        {
            name: "300 ml",
            label: "300 ml",
            value: product300MLCount
        }
    ]
}
module.exports = {
    executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery, checkDepartmentExists, productionCount,
    getCompareData, dateComparisions, checkUserExists, dbError, getBatchId, customerProductDetails, createHash, convertToWords,
    getFormatedNumber, getCompareCustomersData, getCompareDistributorsData, getGraphData
}